import './App.css';
import Card from './Card.js';
import React, { useState, useRef, useEffect } from 'react';
import GoogleSignin from './loginComponent/login';
import GoogleSignout from './loginComponent/logout';
import { gapi } from 'gapi-script';

function App(props) {

  const [displayTheme, setDisplayTheme] = useState('light');

  const [inProgressCards, setInProgressCards] = useState([]);
  const [todoCards, setTodoCards] = useState([]);
  const [completedCards, setCompletedCards] = useState([]);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const [loginSuccess, setLoginSuccess] = useState('false');
  const [userInfo, setUserInfo] = useState(undefined);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "https://www.googleapis.com/auth/drive.readonly"
      })
    };
    gapi.load('client:auth2', start);
    if (loginSuccess === true) {
      setUserInfo(userInfo);
    }
    else {
      setUserInfo();
    }
  })

  function handleLogin(status, userInfo) {
    setLoginSuccess(status);
    if (status) {
      setUserInfo(userInfo);
    }
    else {
      setUserInfo()
    }
    fetch(`${baseUrl}/getUserInfo/${userInfo.googleId}`)
      .then(response => response.json())
      .then(data => handleFillInfo(data));
  }
  function handleSignout(status) {
    setLoginSuccess(status);
    setUserInfo();
    setTodoCards([]);
    setInProgressCards([]);
    setCompletedCards([]);
  }

  const baseUrl = 'http://localhost:8080';

  function handleFillInfo(data) {
    if(data === null) return;
    if(data.todoCards !== undefined || data.todoCards.length !== 0) setTodoCards(data.todoCards);
    if(data.inProgressCards !== undefined || data.inProgressCards.length !== 0) setInProgressCards(data.inProgressCards);
    if(data.completedCards !== undefined || data.completedCards.length !== 0) setCompletedCards(data.completedCards);
  }

  function onChangeTheme(event) {
    const button = document.getElementById("darkModeToggle");
    if (displayTheme === "light") {
      setDisplayTheme("dark")
      button.textContent = "light";
    }
    else {
      setDisplayTheme("light");
      button.textContent = "dark";
    }
  }

  function handleOnDone(index, type) {
    if (type === "todoCard") {
      const componentInProgress = todoCards.filter(todoCard => todoCard.cardId === index);
      const updatedTodoCards = todoCards.filter(todoCard => todoCard.cardId !== index);
      componentInProgress[0].cardType = "inProgressCard";
      const newInProgressCards = [...inProgressCards, componentInProgress[0]];
      const newTodoCards = [...updatedTodoCards];
      setTodoCards(newTodoCards);
      setInProgressCards(newInProgressCards);
      if(userInfo === undefined) return;
      fetch(`${baseUrl}/updateCards`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          todoCards: updatedTodoCards,
          inProgressCards: [...inProgressCards, componentInProgress[0]],
          completedCards: completedCards
        })
      })
    }
    else if (type === "inProgressCard") {
      const componentInProgress = inProgressCards.filter(inProgressCard => inProgressCard.cardId === index);
      const updatedTodoCards = inProgressCards.filter(inProgressCard => inProgressCard.cardId !== index);
      componentInProgress[0].cardType = "Completed";
      setInProgressCards(updatedTodoCards);
      setCompletedCards([...completedCards, componentInProgress[0]]);
      if(userInfo === undefined) return;
      fetch(`${baseUrl}/updateCards`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          todoCards: todoCards,
          inProgressCards: updatedTodoCards,
          completedCards: [...completedCards, componentInProgress[0]]
        })
      })
    }
    else {
      const updatedTodoCards = completedCards.filter(completedCard => completedCard.cardId !== index);
      setCompletedCards(updatedTodoCards);
      if(userInfo === undefined) return;
      fetch(`${baseUrl}/updateCards`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          todoCards: todoCards,
          inProgressCards: inProgressCards,
          completedCards: updatedTodoCards
        })
      })
    }
  }

  function handleDelete(index, type) {
    if (type === "todoCard") {
      const updatedTodoCards = todoCards.filter(todoCard => todoCard.cardId !== index);
      setTodoCards(updatedTodoCards);
      if(userInfo === undefined) return;
      fetch(`${baseUrl}/updateCards`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          todoCards: updatedTodoCards,
          inProgressCards: inProgressCards,
          completedCards: completedCards
        })
      })
    }
    else if (type === "inProgressCard") {
      const updatedTodoCards = inProgressCards.filter(inProgressCard => inProgressCard.cardId !== index);
      setInProgressCards(updatedTodoCards);
      if(userInfo === undefined) return;
      fetch(`${baseUrl}/updateCards`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          todoCards: todoCards,
          inProgressCards: updatedTodoCards,
          completedCards: completedCards
        })
      })
    }
    else {
      const updatedTodoCards = completedCards.filter(completedCard => completedCard.cardId !== index);
      setCompletedCards(updatedTodoCards);
      if(userInfo === undefined) return;
      fetch(`${baseUrl}/updateCards`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          todoCards: todoCards,
          inProgressCards: inProgressCards,
          completedCards: updatedTodoCards
        })
      })
    }
  }

  function handleCreateNew(newIndex, newTitle, newDescription) {
    if (newTitle === undefined || newTitle.length === 0) return 'failed';
    const newCard = { cardId: newIndex, cardTitle: newTitle, cardDescription: newDescription, cardType: "todoCard"};
    setTodoCards([...todoCards, newCard]);
    if(userInfo === undefined) return 'success';
    fetch(`${baseUrl}/updateCards`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userInfo.googleId,
        todoCards: [...todoCards, newCard],
        inProgressCards: inProgressCards,
        completedCards: completedCards
      })
    })
    return 'success';
  }


  return (
    <div className='min-h-screen'>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Comforter&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      </style>
      <div className={`${displayTheme} h-full`}>
        <div className='w-full h-full relative'>
          <header className="fixed w-full flex flex-row justify-between shadow-lg dark:bg-slate-800 dark:shadow-slate-700 dark:shadow-md">
            <div className='pl-2 w-1/3 h-auto bg-blue-500 text-sm font-bold dark:bg-blue-800 flex flex-row items-center'>
              {(loginSuccess !== true) ? <GoogleSignin signin={handleLogin} fillInfo={handleFillInfo} /> : <GoogleSignout user={userInfo} signin={handleSignout} />}
            </div>
            <div className="w-1/3 dark:bg-slate-800 dark:text-white flex flex-row place-content-center">
              <h1 id="pageHeading" className="relative bg-white w-full h-auto flex justify-center justify-baseline items-center dark:bg-slate-800 p-auto m-0 font-myFont m-auto p-5 dark:text-white text-3xl">T
                <span className="absolute top-[1rem] left-[4rem] text-sm transform -translate-x-1/2 -translate-y-1/2"> {userInfo ? <div className='font-bold'><h1>{`${userInfo.givenName}'s`}</h1></div> : <h1></h1>} </span>
                ODO
                <span
                  className="inline-block bg-red-300 dark:bg-blue-500 dark:font-white whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.3em] pb-[0.25em] pt-[0.35em] text-center align-baseline font-bold leading-none text-primary-700">
                  List
                </span>
              </h1>
            </div>
            <div className='w-1/3 bg-red-400 dark:bg-red-800 flex items-center place-content-end'>
              <div className="m-2 dark:place-content-end w-[90px] bg-slate-700 border-2 rounded-full border-black bg-slate-500">
                <button
                  onClick={onChangeTheme}
                  id="darkModeToggle"
                  className="w-full dark:bg-white dark:text-black text-md rounded-full py-1 px-1 bg-slate-800 text-white font-bold hover:shadow-lg transition transition-colors duration-500"
                  alt={displayTheme}
                >
                  {displayTheme === "light" ? "DARK" : "LIGHT"}
                </button>
              </div>
            </div>
          </header>
          <div className='h-[90px] w-full bg-white dark:bg-slate-700'></div>
          <div className="flex flex-row min-h-screen justify-between p-3 dark:bg-slate-700">
            <div className="flex flex-col items-center w-1/3 ">
              <h2 className="dark:text-white font-bold text-center">to-do</h2>
              <Card user={userInfo} type={"newTodo"} onCreateNew={handleCreateNew} />
              {todoCards.map(card => (
                <Card user={userInfo} cardId={card.cardId} cardType={card.cardType} cardTitle={card.cardTitle} cardDescription={card.cardDescription} onDone={handleOnDone} onDelete={handleDelete} />
              ))}
            </div>
            <div className="flex flex-col items-center w-1/3">
              <h2 className="dark:text-white font-bold w-full text-center">in-progress</h2>
              {inProgressCards.map(card => (
                <Card user={userInfo} cardId={card.cardId} cardType={card.cardType} cardTitle={card.cardTitle} cardDescription={card.cardDescription} onDone={handleOnDone} onDelete={handleDelete} />
              ))}
            </div>
            <div className="flex flex-col items-center w-1/3">
              <h2 className="dark:text-white font-bold min-w-96 text-center">completed!</h2>
              {completedCards.map(card => (
                <Card user={userInfo} cardId={card.cardId} cardType={card.cardType} cardTitle={card.cardTitle} cardDescription={card.cardDescription} onDone={handleOnDone} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

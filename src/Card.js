import './Card.css';
import React, { useState } from 'react';
import _uniqueId from 'lodash/uniqueId';

function Card(props) {
	var pTitle = props.cardTitle;
	var pDescription = props.cardDescription;
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	var titleExists = false;

	if (title !== undefined && title.length !== 0) {
		titleExists = true;
	}

	function handleOnChangeBody(event) {
		setDescription(event.target.value);
	}

	function handleOnChangeTitle(event) {
		setTitle(event.target.value);
	}

	function handleClearCard() {
		const result = props.onCreateNew(_uniqueId('prefix-'), title, description);
		if (result === 'failed') {
			return;
		}
		else {
			setTitle("");
			setDescription("");
		}
	}

	return (
		<div className="dark:bg-slate-800 dark:shadow-gray dark- bg-white rounded-xl shadow-lg w-96 h-96 flex flex-col mt-5 mb-5">
			<div className="m-5 h-full flex flex-col justify-evenly">
				<div className="text-xl mb-2 hover:border-blue-500">
					<input value={props.type === "newTodo" ? title : props.cardTitle} onChange={handleOnChangeTitle} className="dark:bg-slate-700 dark:text-white w-full p-1 border-l-2 border-blue-500 hover:border-blue-700 focus:outline-none" placeholder="Title for todo" />
				</div>
				<div className="w-full h-4/6">
					<textarea
						id="myTextArea"
						placeholder="Enter the body"
						value={props.type === "newTodo" ? description : props.cardDescription}
						onChange={handleOnChangeBody}
						className="dark:bg-slate-700 dark:text-white w-full h-full m-auto p-1 resize-none focus:outline-none border-l-2 border-blue-500 focus:border-l-2 hover:border-blue-700"
					/>
				</div>
				<div className="w-full y-1/6">
					{props.type !== "newTodo" ?
						(<div className="w-full y-full flex flex-col justify-evenly">
							<button onClick={() => props.onDone(props.cardId, props.cardType)} className="mt-2 mb-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded transition-colors duration-500"> {props.cardType === "todoCard" ? "Begin Progress" : "mark as completed"}</button>
							<button onClick={() => { props.onDelete(props.cardId, props.cardType) }} className="bg-red-400 rounded hover:bg-red-600 text-white font-bold py-1 px-4 transition-colors duration-500"> delete </button>
						</div>) :
						(<div className="w-full y-full flex flex-col justify-evenly">
							<button onClick={handleClearCard} className={`mt-2 mb-1 text-white font-bold py-3 px-4 rounded transition-colors duration-500 ${!titleExists ? 'bg-gray-500 hover:bg-gray-700' : 'bg-lime-500 hover:bg-lime-700'}`}> + Create New </button>
						</div>)
					}
				</div>
			</div>
		</div>
	)
}

export default Card;
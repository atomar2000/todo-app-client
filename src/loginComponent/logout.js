import { GoogleLogout } from 'react-google-login';

const clientId = "1061492818816-amcl919qkq9llo6dk4lb2q7ro9ele81v.apps.googleusercontent.com";

function GoogleSignout(props) {

    function onSuccess(res){
        props.signin(false);
    }

    return (
        <div id="signOutBtn">
            <GoogleLogout
                clientId={clientId}
                buttonText={"logout"}
                onLogoutSuccess={onSuccess}
                render={(renderProps) => (
                    <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="h-4/5 bg-white shadow-lg flex flex-row items-center p-2 w-full h-full rounded-full"
                    >
                    {props.user && (
                        <div className='rounded-full w-12 mr-2 bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700'>
                            <img src={props.user.imageUrl} alt="profile" className='rounded-full w-12 p-1'/>
                        </div>
                    )}
                    Logout
                    </button>
                )
                }
            />
        </div>
    )
}

export default GoogleSignout;
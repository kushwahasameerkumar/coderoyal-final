import { useContext, useEffect, useState } from 'react';
import '../res/css/LoginPage.css';
import { LoadingIcon } from '../components/loading';
import { UserContext } from '../App';
import { config } from '../config';
import { Link, Redirect, Route } from 'react-router-dom';

export const RegisterPage = (props) => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [fullname, setFullname] = useState(null);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);
    const [msgType, setMsgType] = useState("error");

    const { api_base_url } = config;
    const { loggedIn } = useContext(UserContext);

    useEffect(function () {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && accessToken.length > 0) {
            props.setToken(accessToken);
            props.setLogin(true);
        }
        if (loggedIn) {
            console.log("Login effect: user logged in");
        }
    }, [loggedIn])

    /* 
    Passes props
    - setUserLoggedIn
    */

    function submitHandler(e) {
        if (username && password) {
            setLoading(true);
            e.target.disabled = true;
            e.preventDefault();
            fetch(api_base_url + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, fullname })
            })
                .then(res => res.json())
                .then(res => {
                    //todo: hanlde success
                    console.log(res);
                    if (res.success) {
                        setMsgType("msg");
                        setWarning(res.msg);
                        <Route render={() => {
                            <Redirect to="/dashboard" />
                        }} />
                    } else {
                        setMsgType("error");
                        setWarning(res.msg);
                    }
                })
                .catch(erorr => {
                    //todo: handle error
                    console.error(erorr);
                })
                .finally(() => {
                    setLoading(false);
                    e.target.disabled = false;
                })
        }
    }

    function Warning(props) {
        return (
            <p className="warning" style={props.msg && props.msg.length > 0 ? { visibility: 'visible' } : { visibility: 'hidden' }}>{props.type=="error" ? "Error: " : "Msg: "} {props.msg}</p>
        )
    }

    return (
        <div className="container-fluid h-100" id="login">
            <div className="row justify-content-end h-100">
                {/* <!-- Outermost column  --> */}
                <div className="col-6 d-flex align-items-center box">
                    <div className="row w-100 justify-content-start">
                        {/* <!-- Login container --> */}
                        <div className="col-6 box-inner">
                            <div className="row logo">
                                <p><span>code</span><span>royale</span> </p>
                            </div>
                            <div className="row input-container">
                                <Warning msg={warning} type={ msgType }/>
                                <form>
                                <input type="text" placeholder="Full name" name="fullname" autoComplete="off" onChange={e => { setFullname(e.target.value) }} required />
                                    <input type="text" placeholder="abc@xyz.com" name="email" autoComplete="off" onChange={e => { setEmail(e.target.value) }} required />
                                    <input type="text" placeholder="username" name="username" autoComplete="off" onChange={e => { setUsername(e.target.value) }} required />
                                    <input type="password" placeholder="*****" name="password" autoComplete="off" onChange={e => { setPassword(e.target.value) }} required />
                                    <button type="submit" name="register" onClick={submitHandler}> {!loading ? "Register" : <LoadingIcon />}</button>
                                </form>
                            </div>
                            <div className="row signup">
                                <p>Already have an account? <a href="#"><Link to="/login">Login</Link></a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
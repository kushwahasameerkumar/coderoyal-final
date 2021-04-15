import { Fragment, useContext, useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';
import { TableRow } from '../components/tablerow';
import { UserContext } from '../App';
import { config } from '../config';
import { io } from 'socket.io-client';

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

export const CreateMatchPage = (props) => {
    const [matches, setMatches] = useState([]);

    const [matchFormat, setMatchFormat] = useState("default");
    const [matchVisibility, setMatchVisibility] = useState("public");
    const [startRating, setStartRating] = useState(800);
    const [endRating, setEndRating] = useState(900);
    const [problemsCount, setProblemsCount] = useState(3);

    const { token } = useContext(UserContext);

    const { loggedIn } = useContext(UserContext);
    const { api_base_url } = config;

    const submitHandler = async () => {
        fetch(api_base_url + "match", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchFormat, matchVisibility, startRating, endRating, problemsCount
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    // <Route render={() => {
                    //     <Redirect to="/matches" />
                    // }} />
                    window.location.href = "/matches";
                } else {
                    console.log(res.msg);
                }
            })
    }

    return (
        <Fragment>
            <Navbar />
            <main>
                <div className="container-fluid">
                    <div className="row d-flex justify-content-center" style={{ padding: "80px 150px" }}>
                        {/* <!-- Content goes here --> */}
                        <h3 style={{ textAlign: "center", margin: "30px" }}>Create match</h3>
                        <table className="table table-striped" style={{ maxWidth: "50%", textAlign: "center" }}>
                            <tbody>
                                <tr>
                                    <td><b>Match Format</b></td>
                                    <td>
                                        <select className="form-control" id="input-match-format" style={{ width: "300px" }} onChange={e => {setMatchFormat(e.target.value)}}>
                                            <option value="default">Default</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Match visibility</b></td>
                                    <td>
                                        <select className="form-control" id="input-match-visibility" style={{ width: "300px" }} onChange={e => {setMatchVisibility(e.target.value)}}>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Start rating</b></td>
                                    <td>
                                        <input className="form-control" type="number" id="input-match-start-rating" placeholder="800" style={{ width: "300px" }} onChange={e => {setStartRating(e.target.value)}}></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>End rating</b></td>
                                    <td>
                                        <input className="form-control" type="number" id="input-match-end-rating" placeholder="900" style={{ width: "300px" }} onChange={e => {setEndRating(e.target.value)}}></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Problems count</b></td>
                                    <td>
                                        <input className="form-control" type="number" id="input-match-problems-count" placeholder="3" style={{ width: "300px" }} onChange={e => {setProblemsCount(e.target.value)}}></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row" style={{ margin: "0px" }}>
                        <button type="button" className="btn btn-success" style={{ width: "100px", marginLeft: "47%"}} onClick={submitHandler}>Submit</button>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}
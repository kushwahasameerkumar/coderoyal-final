import { Fragment, useContext, useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';
import { TableRow } from '../components/tablerow';
import { UserContext } from '../App';
import { config } from '../config';
import { io } from 'socket.io-client';
import { Link } from "react-router-dom";

export const MatchPage = (props) => {
    const [matches, setMatches] = useState([]);
    
    const { loggedIn } = useContext(UserContext);
    const { api_base_url } = config;

    useEffect(function () {
        fetch(api_base_url + '/match')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setMatches(res.data);
                } else {
                    console.warn("Error from API");     //todo: handle api success: false
                }
            })
            .catch(err => {
                console.log("Error while fetching matches");    //todo: handle error
            })
    }, []);

    return (
        <Fragment>
            <Navbar />
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <Link to="/matches/create"><button className="btn btn-success" style={{height: "70px", position: "absolute", bottom: "10px", width: "95%"}} >Create match</button></Link>
                    </div>
                    <div className="row d-flex justify-content-center" style={{padding: "80px 150px"}}>
                        {/* <!-- Content goes here --> */}
                        <table className="table table-striped" style={{maxWidth: "50%", textAlign: "center"}}>
                            <thead>
                                <tr>
                                    <th>Match ID</th>
                                    <th>Created at</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map(match => <TableRow key={match._id} id={match._id} created_at={match.created_at}/>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}
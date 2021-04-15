import { Fragment, useContext, useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';
import { config } from '../config';
import { LoadingIcon } from '../components/loading';
import { io } from 'socket.io-client';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from "../App";
import { decodeToken } from 'react-jwt';

export const RoomPage = (props) => {
    const [players, setPlayers] = useState([]);
    const user = useContext(UserContext);
    useEffect(function () {
        console.log("Connecting...", user)
        const username = decodeToken(user.token) ? decodeToken(user.token).username : null;

        const socket = io(config.SOCKET_ENDPOINT, { auth: { token: user.token }, query: { match_id: id } });

        socket.on('connect', () => {
            console.info("connected to socket");
        });

        socket.on('player_joined', (playersList) => {
            console.log(playersList);
            setPlayers(playersList.filter(player => player.username != username));
        });

        socket.on('player_left', (playersList) => {
            console.log(playersList);
            setPlayers(playersList.filter(player => player.username != username));
        })

        socket.on('disconnect', () => {
            console.info("disconnected from socket");
        });

        socket.on('connect_error', (err) => {
            console.warn(err.message, err.data);
        });

        return () => socket.disconnect();

    }, [user.token]);   //todo: []

    const { id } = useParams();

    function PlayerItem(props) {
        return (
            <div className="player-item" style={{ fontWeight: 500, backgroundColor: "#d36969", color: "#f9f9f9", width: "150px", height: "50px", padding: "14px", textAlign: "center", borderRadius: "10px", position: "relative", margin: "20px" }}>
                {props.username}
                {/* <div class="player-badge" style={{ position: "absolute", top: -5, left: 0, fontSize: "10px", color: "#d36969"}}>
                    OPPONENT
                </div> */}
            </div>
        );
    }

    return (
        <Fragment>
            <Navbar />
            <main>
                <div className="container-fluid d-flex justify-content-center align-items-center">
                    <div className="row w-100 justify-content-center" style={{ padding: "80px 150px" }}>
                        {/* <!-- Content goes here --> */}
                        <p style={{ textAlign: "center", fontWeight: 400, fontSize: "24px" }}>
                            <LoadingIcon style={{ fontWeight: 500, fontSize: "30px", color: "green" }} /> Waiting for other players to join
                        </p>
                        <div className="row players align-content-center justify-content-center" style={{ margin: "100px 10px" }}>
                            {players.map(player => <PlayerItem key={player.username} username={player.username} />)}
                        </div>


                        <button className="start-match" style={{ width: "200px", height: "50px", backgroundColor: "green", color: "#f9f9f9", borderStyle: "none", margin: "20px" }}>
                            <Link to={`/matches/problems/${id}`} style={{ color: "#f9f9f9", textDecoration: 'none'}}>
                                Start match
                            </Link>
                        </button>

                    </div>
                </div>
            </main>
        </Fragment>
    );
}
import { NavLink } from 'react-router-dom';
import { UserContext } from "../App";
import { decodeToken } from 'react-jwt';
import { Fragment, useContext, useEffect, useState } from "react";

export const Navbar = (props) => {
    const user = useContext(UserContext);
    const id = decodeToken(user.token) ? decodeToken(user.token)._id : null;
    const prof="/profile/"+id;
    return (
        <navbar>
            <div className="container-fluid h-100">
                <div className="row">
                    <div className="col-3">
                        <div className="logo">
                            <p><span>code</span><span>royale</span></p>
                        </div>
                    </div>
                    <div className="col-9 d-flex justify-content-end align-items-center">
                        <div className="nav-items">
                            {/* <span className="active"><NavLink to="/dashboard">Home</NavLink></span> */}
                            <span className="active"><NavLink to="/matches">Matches</NavLink></span>
                            {/* <span><a href="#">Tournaments</a></span> */}
                            <span><a href="/LeaderBoard">LeaderBoard</a></span>
                            <span><a href={prof} >Profile</a></span>
                            <span><NavLink to="/logout">Logout</NavLink></span>
                        </div>
                    </div>
                </div>
            </div>
        </navbar>
    );
}
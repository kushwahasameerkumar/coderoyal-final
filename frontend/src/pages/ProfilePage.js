import { Fragment } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';
import  userLogo  from  '../images/user.jpg';
import {Modal,Button,Table} from 'react-bootstrap';
import React from "react";
import { config } from '../config';
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import  axios  from "axios";

export const ProfilePage = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [site,setSite] = React.useState(null);
    const [pass,setPass] = React.useState(false);
    const [profile,setProfile] = React.useState(null);
    const [submission,setSubmission] = React.useState(null);
    const [list,setlist] = React.useState(null);
    const [rating,setRating] = React.useState(500);
    const { id } = useParams();
    const { api_base_url } = config;
    console.log(id.type);
    
    useEffect(async function () {
        const data = await fetch(`${api_base_url}profile/${id}`);
        const profil = await data.json();
        setProfile(profil.data);
        console.log(profile);
    }, []);

    useEffect(async function () {
      if(profile&&profile.handles&&profile.handles.codeforces)
      {
        const Rating = await fetch(`https://codeforces.com/api/user.rating?handle=${profile.handles.codeforces}`);
        const rat = await Rating.json();
        if(rat.result)
        setRating(rat.result[rat.result.length-1].newRating);
        else
        setRating(null);
      }
    }, [profile]);
    
    useEffect(async function () {
        if(profile)
        {   
            const submissions=profile.submissions;
            console.log("7284",profile.submissions);
            const dat = await fetch(`${api_base_url}getSubmissions/${submissions}`);
            const sub = await dat.json();
            console.log("data",sub.data[0]);
            setSubmission(sub.data);
            console.log("submission",submission);
        }

  }, [profile]);
    
    async function updateHandle(userHandle) {
      console.log("User Handle", userHandle)
      // POST request using axios inside useEffect React hook
      const data = { _id: id, site, userHandle};

      await axios.post(api_base_url+"updateHandle/", data)
        .then((response) => {
          console.log(response.data)
        });
      var dat = await fetch(`${api_base_url}profile/${id}`);
      var profil = await dat.json();
      setProfile(profil.data);
      console.log(profile);
      setModalShow(false);
    };
    async function updatePassword(password) {
      console.log("password", password);
      // POST request using axios inside useEffect React hook
      const data = { _id: id, password};

      await axios.post(api_base_url+"updatepassword/", data)
        .then((response) => {
          console.log(response.data);
        });
      setPass(false);
    };
    
    useEffect(async function () {
      
      const lists=[];
      if(submission)
      for(var i=0;i<submission.length;i++)
      { 
        lists.push(<tr>
          <td>{i+1}</td>
          <td>{submission[i].submissionId}</td>
          <td>{submission[i].language}</td>
          <td>{submission[i].problemId}</td>
          <td>{submission[i].match}</td>
          <td>{submission[i].created_at}</td>
          <td>{submission[i].verdict}</td>
        </tr>)
      }
      setlist(lists);

    }, [submission]);
    
    return (
        <Fragment>
            <Navbar />
            <main>
                <div className="container-fluid">
                    <div className="row d-flex " style={{ padding: "80px 150px" }}>
                        <div className="container" style={{ backgroundColor:"#E6E6FA" , padding:"20px 10% 10px 10%" , float:"left"}}>
                            <div className="header" style={{  }}>
                                <h3><b>Your Profile </b></h3>
                            </div>
                            <hr></hr>
                            <div className="details" style={{ padding:"0 2% 0 2%"}}>
                                
                                <img className="profilePic" src={userLogo} height="264" width="264" alt="logo" style={{ float:"left", border:"2px solid black" }}/>

                                <div className="userDetails" style={{ backgroundColor:"#FAFFD7" , padding:"5% 10% 5% 10%", float:"left" ,marginLeft:"10%", height:"264px", alignItems:"center"}}>
                                    <h4>Name: <b>{profile?(profile.fullName?profile.fullName:"Full Name Not Set"):"Full Name Not Set"}</b></h4>
                                    <h4>Email: <b>{profile?(profile.email?profile.email:"Email Not Set"):"Email Not Set"}</b></h4>
                                    <h4>Username: <b>{profile?(profile.username?profile.username:"Username Not Set"):"Username Not Set"}</b></h4>
                                    <h4>Account Created at: <b>{profile?(profile.created_at?profile.created_at:"Creation Not Set"):"Creation Not Set"}</b></h4>
                                </div>
                            </div>
                            <div className="userHandles" style={{ display:"inline-block", margin:"10% 2%  2%"}}>
                                <h4> <b>User Handles </b></h4>
                                <br></br>
                                <div style={{ padding:"10% 0 10% 0" , marginLeft:"50px"}}>
                                    <h5>CodeForces Handle: &emsp;  {profile?(profile.handles?(profile.handles.codeforces?profile.handles.codeforces:"Handle Not Set"):"Handle Not Set"):"Handle Not Set"}  &emsp;&emsp;  <button className="btn btn-secondary float-right"  type="button" variant="primary" onClick={() => {setModalShow(true);setSite("codeforces")}}> <i className="fa fa-pencil-square-o" aria-hidden="true">Edit</i></button></h5> 
                                    <h5>CodeChef Handle: &emsp;  {profile?(profile.handles?(profile.handles.codechef?profile.handles.codechef:"Handle Not Set"):"Handle Not Set"):"Handle Not Set"}  &emsp;&emsp; <button className="btn btn-secondary" onClick={() => {setModalShow(true);setSite("codechef")}}> <i className="fa fa-pencil-square-o" aria-hidden="true">Edit</i></button></h5>
                                    <h5>StopStalk Handle: &emsp;  {profile?(profile.handles?(profile.handles.stopstalk?profile.handles.stopstalk:"Handle Not Set"):"Handle Not Set"):"Handle Not Set"}  &emsp;&emsp; <button className="btn btn-secondary" onClick={() => {setModalShow(true);setSite("stopstalk")}}> <i className="fa fa-pencil-square-o" aria-hidden="true">Edit</i></button></h5>
                                    <MyVerticallyCenteredModal
                                      show={modalShow}
                                      onHide={() => setModalShow(false)}
                                      save={(userHandle)=>updateHandle(userHandle)}
                                      site={site}
                                    />
                                </div>
                            </div>
                            <div className="Rating" style={{  margin:"0 2% 0 2%"}}>
                                <h4><b>Rating </b></h4>
                                <div className="Ratings" style={{ padding:"5% 0 5% 0" , marginLeft:"50px"}}>
                                    <h5>PlateForm Rating: <b>{submission?500+submission.length*5:"500"}</b></h5>
                                    <h5>CF Rating : <b>{profile?.handles?.codeforces?(rating??"Incorrect Handle"):"Handle Not Set"}</b> </h5>
                                </div>
                            </div>
                            <div className="Submissions" style={{ margin:"0 2% 0 2%" }}>
                                <h4><b>Recent Submissions</b> &emsp; <h5>&emsp;(Last 10 Submissions)</h5></h4>
                                <div>
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                          <tr>
                                            <th>#</th>
                                            <th>submissionId</th>
                                            <th>language</th>
                                            <th>problemId</th>
                                            <th>Match</th>
                                            <th>submission time</th>
                                            <th>verdict</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {list}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <div style={{ margin:"10% 2% 10% 2%" }} className="Password">
                                <button className="btn btn-success" onClick={() => {setPass(true);}}><h4><b>Change Password</b></h4></button>
                                <ChangePasswordModal
                                      show={pass}
                                      onHide={() => setPass(false)}
                                      change={(password) => updatePassword(password)}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}

function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change {props.site} handle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className="input-group">
                <input type="text" id="handleInput" className="form-control" placeholder="Handle" aria-label="Handle" aria-describedby="basic-addon2"></input>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger"  onClick={props.onHide}>Close</Button>
          <Button className="btn btn-success" onClick={() => props.save(document.getElementById("handleInput").value)}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  function ChangePasswordModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className="input-group">
                <input id ="changePass" type="password" className="form-control" placeholder="New Password" aria-label="Password" aria-describedby="basic-addon2"></input>               
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger"  onClick={props.onHide}>Close</Button>
          <Button className="btn btn-success" onClick={() => props.change(document.getElementById("changePass").value)}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
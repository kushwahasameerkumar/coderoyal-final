import { Fragment, useEffect,useState } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';
import { useParams } from "react-router-dom";
import { config } from '../config';
import React from "react";
export const LeaderBoard = (props) => {
    const [ profiles,setProf] = React.useState(null);
    const [ list,setList] = React.useState(null);
    const { api_base_url } = config;
    useEffect(async function(){
        
        const data = await fetch(`${api_base_url}allprofile/`);
        let profile = await data.json();
        console.log("pro",profile.data);

        profile.data.sort(function(a,b){return b.submissions.length-a.submissions.length})
        setProf(profile.data);
        //console.log("pro",profile.data);
        
    },[]);
    

    useEffect(async function(){
        let x=[]
        if(profiles)
        for(let i=0;i<profiles.length;i++)
        {
            x.push(
             <tr>
               <th scope="row">{i+1}</th>
               <td>{profiles[i].username}</td>
               <td>{500 +(profiles[i].submissions.length)*5}</td>
             </tr>
                            
            )
        }
        setList(x);
        
    },[profiles]);

    return (
        <Fragment>
            <Navbar />
            <main>
                <div className="container-fluid">
                    <div className="row d-flex justify-content-end" style={{ padding: "80px 150px" }}>
                        <div className="container">
                            <table class="table table-striped table-dark">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">username</th>
                                  <th scope="col">rating</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {list}
                              </tbody>
                            </table>
                        </div>
                    </div>  
                </div>
            </main>
        </Fragment>
    );
}
import { Fragment, useContext, useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';
import '../res/css/QuestionPage.css';
import { UserContext } from '../App';
import { config } from '../config';
import { useParams } from "react-router-dom";
import { LoadingIcon } from "../components/loading";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { render } from "react-dom";
import { SubmissionTable } from "../components/submission-table";

export const QuestionPage = (props) => {

    const { token } = useContext(UserContext);
    const [problemSet, setProblemSet] = useState([]);
    const [active, setActive] = useState(0);
    const [problemStatement, setProblemStatement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [problemSetLoading, setProblemSetLoading] = useState(true);
    const [op, setOp] = useState("Output will be displayed here...");
    const [content, setContent] = useState(`#include<bits/stdc++.h>

using namespace std;

int main(){
    
    return 0;
}`);

    const [submissions, setSubmissions] = useState([]);

    useEffect(async function () {
        if (token && token.length > 0) {
            const data = await fetch(`${api_base_url}submissions/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const json = await data.json();
            if (json.success) {
                setSubmissions(json.data);
            }
        }

    }, [token]);

    useEffect(async function () {
        const data = await fetch(`${api_base_url}match/${id}`);
        const match = await data.json();
        setProblemSet(match.data.problems);
        setProblemSetLoading(false);
    }, []);

    useEffect(async function () {
        if (problemSet.length > 0) {
            const problem = problemSet[active];
            const [contestId, index] = problem.problemId.split("$$");
            const data = await fetch(`${api_base_url}problem/${contestId}/${index}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const json = await data.json();
            const html = json.data;
            setProblemStatement(html);
            renderMath();
            setLoading(false);
        }
    }, [active, problemSet]);

    useEffect(async function () {
        submissions.forEach(submission => {
            if (!isRejected(submission) && !isAccepted(submission)) {
                setTimeout(function () {
                    updateSubmissions(submission.submissionId);
                }, 2000)
            }
        })
    }, [submissions, token]);

    const { id } = useParams();
    const { api_base_url } = config;

    const updateSubmissions = async (submissionId) => {
        try {
            const data = await fetch(api_base_url + "updateSubmission/" + submissionId, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await data.json();
            setSubmissions(submissions.map(submission => {
                if (submission.submissionId == submissionId && (isAccepted(json.data) || isRejected(json.data))) {
                    submission.verdict = json.data.verdict;
                }
                return submission;
            }));
        } catch (e) {
            console.log(e);
        }
    }

    const acceptedTerms = ["Accepted"];
    const rejectedTerms = ["Wrong", "Exceeded", "Error"];

    const isRejected = (submission) => {
        let toReturn = false;
        rejectedTerms.forEach(term => {
            if (submission.verdict.includes(term)) {
                toReturn = true;
            }
        })
        return toReturn;
    }

    const isAccepted = (submission) => {
        let toReturn = false;
        acceptedTerms.forEach(term => {
            if (submission.verdict.includes(term)) {
                toReturn = true;
            }
        })
        return toReturn;
    }

    const renderMath = (time = 50) => {
        setTimeout(() => {
            window.MathJax.typeset();
        }, time);
    }

    function handleTabItemClick(e) {
        const tag = e.target.attributes['data-tag'].value;
        if (tag != active) {
            setActive(tag);
            setLoading(true);
        }
    }

    function TabItem(props) {
        const [contestId, index] = props.problem.problemId.split("$$");
        return (
            <li className="nav-item" style={{ cursor: "pointer" }}>
                <a className={props.tag == active ? "nav-link active" : "nav-link"} aria-current="page" data-tag={props.tag} data-contest-id={contestId} data-index={index} onClick={handleTabItemClick}>{props.problem.problemName}</a>
            </li>
        )
    }

    function ProblemStatement(props) {
        return (
            <div style={{ backgroundColor: "#f9f9f9" }} dangerouslySetInnerHTML={{ __html: props.html }}></div>
        )
    }

    function onChangeEditor(val) {
        setContent(val);
        renderMath(1000);   //fix 
    }

    function runClickHandler(e) {
        setOp("Please wait...");
        fetch(api_base_url + "compile", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const tempOp = res.data.join("");
                    console.log(tempOp);
                    setOp(tempOp);
                } else {
                    setOp("Error: ", res.msg);
                }
            })
    }

    function submitClickHandler(e) {
        const [contestId, index] = problemSet[active].problemId.split("$$");
        fetch(api_base_url + `submit/${id}/${contestId}/${index}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                lang: 'cpp',
                source: content
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    console.log(res.msg, res.data);
                    const tempSubmissions = submissions;
                    tempSubmissions.push(res.data);
                    setSubmissions(tempSubmissions);
                    console.log(submissions);
                } else {
                    console.error("Error: ", res.msg);
                }
            })
            .catch(console.log);
    }

    return (
        <Fragment>
            <Navbar />
            <main>

                <div className="container-fluid">
                    <div className="row d-flex justify-content-center" style={{ padding: "80px 80px" }}>
                        {/* <!-- Content goes here --> */}
                        <div className="row">
                            <div className="col-9">
                                <div className="row">
                                    {/* Problems tab */}
                                    <ul className="nav nav-tabs">
                                        {!problemSetLoading ? <Fragment>{problemSet.map((problem, i) => <TabItem key={i} tag={i} problem={problem} />)}</Fragment> : null}
                                    </ul>
                                    {/* Problem statement */}
                                    {!loading ? <ProblemStatement html={problemStatement} /> : <div className="d-flex justify-content-center" style={{ margin: "50px" }}><LoadingIcon style={{ fontWeight: 500, fontSize: "30px", color: "black" }} /></div>}
                                    {/* <Editor /> */}
                                    {/* <div id="editor" style={{ "height": "500px" }}>
                                        editor
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row" style={{margin: "20px", backgroundColor: "#f9f9f9", maxHeight: "500px", overflowY: "scroll", overflowX: "hidden"}}>
                                    <h4 style={{textAlign: "center", margin: "20px"}}>My Submissions</h4>
                                    <SubmissionTable submissions={ submissions } />
                                </div>
                            </div>
                        </div>

                        <AceEditor
                            mode="java"
                            theme="monokai"
                            name="editor"
                            fontSize={20}
                            onChange={onChangeEditor}
                            editorProps={{ $blockScrolling: true }}
                            style={{ width: "100%", marginTop: "30px" }}
                            value={content}
                        />

                        <div className="editor-btn" style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                            <button className="btn btn-secondary" style={{ marginTop: "20px", width: "100px" }} onClick={runClickHandler}>Run</button>
                            <button className="btn btn-success" style={{ marginTop: "20px", marginLeft: "20px", width: "100px" }} onClick={submitClickHandler}>Submit</button>
                        </div>

                        <div className="editor-op" style={{ margin: 0 }}>
                            <textarea style={{ margin: "0", marginTop: "20px", width: "100%", height: "200px" }} readOnly value={op}></textarea>
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}
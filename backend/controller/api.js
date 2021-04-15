const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const { auth } = require(path.resolve('middleware', 'auth.js'));

//todo: secure secret key
const secret = process.env.ACCESS_TOKEN;

//import models
const User = require(path.resolve('model', 'user.js'));
const Match = require(path.resolve('model', 'match.js'));
const Submission = require(path.resolve('model', 'submission.js'));
router.use("/", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*"); //todo: minimize headers
    next();
})

router.post("/login", async (req, res) => {
    /*  TODO
        - Sanetize user inputs
        - Handle null and error cases
        - Return and correct status code
    */
    const { username, password } = req.body;
    //todo: handle exists check failure
    if (await User.exists({ username, password })) {
        //User exist
        //todo: token expiry and renewal & token params selections

        const user = await User.findOne({ username, password }, (err, doc) => {
            if (err) {
                return res.status(500).json({ success: false, msg: "Internal server error occured." });
            }
            const token = jwt.sign({ username, _id: doc._id }, secret);
            return res.status(200).json({ success: true, msg: "Login successfull.", token })
        })
    } else {
        //User not exist
        return res.status(400).json({ success: false, msg: "Invalid username or password." });
    }

});

router.post("/register", async (req, res) => {
    /*  TODO
        - Sanetize user inputs
        - Handle null and error cases
        - Return and correct status code
    */
    const { username, email, password, fullname } = req.body;

    //todo: handle exists check failure
    if (await User.exists({ email })) {
        return res.json({ success: false, msg: "Email already exists." });
    }

    if (await User.exists({ username })) {
        return res.json({ success: false, msg: "Username already taken." });
    }

    const user = new User({
        username,
        email,
        password,
        fullName: fullname
    });

    await user.save(function (err, doc) {
        if (err) {
            console.error(err);
            return res.json({ success: false, msg: "User not created." });
        }
        return res.json({
            success: true,
            msg: "User created successfully",
            data: doc //todo: return minimal
        })
    })
});

//tournament 
/* 
    TODO:
    - everything
*/
router.get("/match", async (req, res) => {
    await Match.find((err, doc) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        return res.json({
            success: true,
            msg: "Matches fetched successfully",
            data: doc //todo: return minimal
        })
    });
});

router.get("/match/:id", async (req, res) => {
    await Match.findOne({ _id: req.params.id }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        return res.json({
            success: true,
            msg: "Match fetched successfully",
            data: doc //todo: return minimal
        })
    });
});

router.get("/profile/:id", async (req,res) => {
    console.log(req.params.id);
    
    await User.findOne({ _id: req.params.id}, (err,doc) =>{
        if(err){
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        //Todo: return minimal
        console.log("backend "+ doc);
        return res.json({
            success: true,
            msg: "Profile fetched successfully",
            data: doc 
        })

    });
});

router.get("/allprofile/", async (req,res) => {
    
    
    await User.find({ }, (err,doc) =>{
        if(err){
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        //Todo: return minimal
        console.log("backend "+ doc);
        return res.json({
            success: true,
            msg: "Profile fetched successfully",
            data: doc 
        })

    });
});
router.get("/getSubmissions/:submissions", async (req,res) => {
    
    const tmp=req.params.submissions.split(",");
    console.log("req",tmp);

    await Submission.find({ _id : {$in:tmp}}, (err,result) =>{
        if(err)
        {
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        console.log("backend2 "+ result);
        return res.json({
            success: true,
            msg: "Submissions fetched successfully",
            data: result 
        })
    });
});

router.post("/updatepassword/", async (req,res) => {
    console.log(req.body._id,req.body.password);
    
    var query={ _id: req.body._id};
    var setval={$set:{'password':req.body.password}};
    
    console.log(setval);
    await User.updateOne(query,setval, function(err,result){
        if(err)
        {
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        console.log(result);
        return res.json({
            success: true,
            msg: "password updated successfully",
            data: result
        })
    });
   
});
router.post("/updateHandle/", async (req,res) => {
    console.log(req.body._id,req.body.userHandle,req.body.site);
    
    var query={ _id: req.body._id};
    var setval;
    if(req.body.site=="codeforces")
    {
       setval ={ $set: { 'handles.codeforces' : req.body.userHandle} }
    }
    if(req.body.site=="codechef")
    {
       setval ={ $set: { 'handles.codechef': req.body.userHandle} }
    }
    if(req.body.site=="stopstalk")
    {
       setval ={ $set: { 'handles.stopstalk': req.body.userHandle} }
    }
    console.log(setval);
    await User.updateOne(query,setval, function(err,result){
        if(err)
        {
            console.log(err);
            return res.json({ success: false, msg: "DB error." });
        }
        console.log(result);
        return res.json({
            success: true,
            msg: "handle updated successfully",
            data: result
        })
    });
   
});


const { getProblemSet, getProblemHtml } = require('../includes/cf/problems');

function randomIndex(len) {
    return Math.floor(Math.random() * (len));
}

router.post("/match", auth, async (req, res) => {
    const { matchFormat, matchVisibility, startRating, endRating, problemsCount } = req.body;
    let problems = [];
    try {
        let problemSet = await getProblemSet(startRating, endRating); //todo: set _start_rating and _end_rating
        console.log(problemSet[1]) //cm
        let problemCount = problemsCount; //done: todo: set count
        while (problemCount) {
            const i = randomIndex(problemSet.length);
            problems.push(problemSet[i]);
            problemSet.splice(i, 1);
            --problemCount;
        }
        problems = problems.map(problem => {
            // return { contestId: problem.contestId, index: problem.index, name: problem.name };
            return {
                problemId: `${problem.contestId}$$${problem.index}`,
                problemName: problem.name,
                problemPoints: problem.rating //todo: fix rating algo
            };
        });

        const match = new Match({
            problems,
            created_by: req.auth._id
        });
        await match.save((err, doc) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, msg: "Match not created." });
            }
            return res.json({
                success: true,
                msg: "Match created successfully",
                data: doc //todo: return minimal
            });
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }

});


router.get("/problem/:contestId/:index", auth, async (req, res) => {
    const { contestId, index } = req.params;
    try {
        const problem = await getProblemHtml(contestId, index);
        return res.status(200).json({ success: true, data: problem });
    } catch (e) {
        return res.status(500).json({ success: false, erorr: e });
    }
});

//compiler utils
const compiler = require(path.resolve("includes", "compiler.js"));
router.post("/compile", async (req, res) => {
    const { content } = req.body;
    try {
        const data = await compiler(content);
        return res.status(200).json({ success: true, msg: "compile_success", data });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
});

const submit = require(path.resolve("includes", "cf", "submit.js"));
const login = require("../includes/cf/login");
const { getSubmission } = require("../includes/cf/submissions");
const { getTags } = require("../includes/cf/tag");
const { json } = require("express");
router.post("/submit/:matchId/:contestId/:index", auth, async (req, res) => {
    const { matchId, contestId, index } = req.params;
    const typeId = {
        "cpp": 50
    }
    try {
        const { lang, source } = req.body;
        const tags = await login();
        const submissionData = await submit(tags, {
            contestId,
            problemIndex: index,
            programTypeId: typeId[lang] ? typeId[lang] : 50,    //default to cpp
            source
        });

        const submission = new Submission({
            submissionId: submissionData.id,
            language: lang,
            verdict: submissionData.verdict,
            problemId: contestId + index,
            match: matchId,
            created_by: req.auth._id,
        });

        await submission.save(function (err, doc) {
            if (err) {
                return res.status(500).json({ success: false, error: err });
            }
            return res.status(200).json({ success: true, msg: "Solution submitted successfully...", data: doc });
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
});

router.post("/updateSubmission/:submissionId", auth, async (req, res) => {
    try {
        const { submissionId } = req.params;
        const tags = await getTags();
        const submissionData = await getSubmission(tags, submissionId);

        const acceptedTerms = ["Accepted"];
        const rejectedTerms = ["Wrong", "Exceeded", "Error"];

        if (submissionData.verdict.includes("Accepted")) {
            await Submission.updateOne({ created_by: req.auth._id, submissionId }, { $set: { verdict: "Accepted" } });
            return res.status(200).json({ success: true, msg: "Solution accepted", data: submissionData });
        } else {
            if (isRejected(submissionData)) {
                await Submission.updateOne({ created_by: req.auth._id, submissionId }, { $set: { verdict: submissionData.verdict } });
            }
            return res.status(200).json({ success: true, msg: "", data: submissionData });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
});

router.get("/submissions/:matchId?", auth, async (req, res) => {
    try {
        const { matchId } = req.params;
        const filter = { created_by: req.auth._id };
        if (matchId) {
            filter.match = matchId;
        }
        await Submission.find(filter, (err, doc) => {
            if (err) {
                return res.status(500).json({ success: false, error: err });
            }
            return res.status(200).json({ success: true, msg: "Submissions fetched successfully", data: doc });
        })
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
});

//utils

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

module.exports = router;
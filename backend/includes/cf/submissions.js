const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const { getTags } = require('./tag');

const getAllSubmissions = async (handle = 'codexcode') => {
    const submissions = [];
    
    let res = await fetch("https://codeforces.com/submissions/"+handle);
    res = await res.text();

    let html = parse(res);
    const table = html.querySelector(".status-frame-datatable");
    const rows = table.querySelectorAll("tr").filter(row => {
        return row.nodeType == 1;
    });
    // console.log(rows);
    rows.forEach(row => {
        const idCell = row.querySelector(".id-cell");
        if (idCell) {
            const submission = {};
            submission.id = idCell.removeWhitespace().innerText;
            submission.verdict = row.querySelector(".status-cell").removeWhitespace().innerText;
            submissions.push(submission);
        }
    });

    return submissions;
}

const getSubmission = async (tags, id) => {
    const submission = {};

    let res = await fetch("https://codeforces.com/data/submitSource", {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-csrf-token": tags.csrf,
          "x-requested-with": "XMLHttpRequest"},
        "referrer": "https://codeforces.com/problemset/status?my=on",
        "body": `submissionId=${id}&csrf_token=${tags.csrf}`,
        "method": "POST",
        "mode": "cors"
      });
    res = await res.json();

    submission.id = id;
    submission.verdict = parse(res.verdict).innerText;
    submission.source = res.source;

    return submission;
}


const parseAllSubmissions = async (res) => {
    const submissions = [];
    let html = parse(res);
    const table = html.querySelector(".status-frame-datatable");
    const rows = table.querySelectorAll("tr").filter(row => {
        return row.nodeType == 1;
    });
    // console.log(rows);
    rows.forEach(row => {
        const idCell = row.querySelector(".id-cell");
        if (idCell) {
            const submission = {};
            submission.id = idCell.removeWhitespace().innerText;
            submission.verdict = row.querySelector(".status-cell").removeWhitespace().innerText;
            submissions.push(submission);
        }
    });

    return submissions;
}
// getAllSubmissions().then(async submissions => {
//     const tags = await getTags();
//     getSubmission(tags, submissions[1].id).then(console.log);
// });

module.exports = { getAllSubmissions, getSubmission, parseAllSubmissions };
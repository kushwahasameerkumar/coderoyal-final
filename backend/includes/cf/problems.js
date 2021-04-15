const { parse } = require('node-html-parser');
const fetch = require('node-fetch');

/**
 * Returns <HTML> : extracted question.
 * 
 * @param {int} _contestId
 * @param {char} _index : problem level eg. A,B,C...
 */
const getProblemHtml = async function (_contestId, _index) {

    let html = await fetch(`https://codeforces.com/contest/${_contestId}/problem/${_index}`);
    if (html.length == 0)
        throw new Error("empty response from cf");
    html = await html.text();
    const root = parse(html);
    const problemStatement = root.querySelector('.problem-statement').toString();
    if (problemStatement.length == 0)
        throw new Error("problem statement error");
    return problemStatement;

}


/**
 * Returns problem set in given start and end rating along with index.
 * return = {contestId: number, index: string, name: string, type: string, points: decimal, rating: number, tags: array[string]}
 * 
 * @param {number} _start_rating   >= 800
 * @param {number} _end_rating     <= 3500
 * @param {string} _index?         level eg. A, B, B1...
 * 
 */
const getProblemSet = async function (_startRating, _endRating, _index) {
    // rating ranges from 800 to 3500

    const data = await fetch('https://codeforces.com/api/problemset.problems');
    const json = await data.json();
    if (json.status != 'OK')
        throw new Error("Response error: " + json.comment);

    let problems = [];

    if (typeof _index === 'undefined') {
        problems = json.result.problems.filter(problem => problem.rating >= _startRating && problem.rating <= _endRating);
    } else {
        problems = json.result.problems.filter(problem => problem.rating >= _startRating && problem.rating <= _endRating && problem.index == _index);
    }

    return problems;
}


module.exports = {
    getProblemHtml,
    getProblemSet
}
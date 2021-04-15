const fetch = require("node-fetch");
const { parseAllSubmissions } = require("./submissions");


/* 
tags {
    csrf: ___,
    ftaa: ___,
    bfaa: ___
}

options {
    contestId: ___,
    problemIndex: ___,
    programTypeId: ___,
    source: ___
}
*/
const submit = async (tags, options) => {
    const body = `csrf_token=${tags.csrf}&ftaa=${tags.ftaa}&bfaa=${tags.bfaa}&action=submitSolutionFormSubmitted&submittedProblemCode=${options.contestId + options.problemIndex}&programTypeId=${options.programTypeId}}&source=${encodeURIComponent(options.source)}&tabSize=4&_tta=955`;
    const res = await fetch("https://codeforces.com/problemset/submit?csrf_token=9a349a57e7d4878c026bfb3d193485d8", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": "lastOnlineTimeUpdaterInvocation=1617108995053; __utmz=71512449.1616078355.13.3.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); JSESSIONID=4F6FA7A2EF1CCD38921CB3F4C142C58D-n1; 39ce7=CF5Rn3KK; __utmc=71512449; evercookie_png=4g07rjjtqjgyw9h86q; evercookie_etag=4g07rjjtqjgyw9h86q; evercookie_cache=4g07rjjtqjgyw9h86q; 70a7c28f3de=4g07rjjtqjgyw9h86q; X-User=; X-User-Sha1=8b66a5f641eaef2fa18a0c82671ec00d44e0ebf3; lastOnlineTimeUpdaterInvocation=1617138964934; __utma=71512449.987620274.1612816938.1617167947.1617171210.24; __utmt=1; __utmb=71512449.7.10.1617171210"
        },
        "referrer": "https://codeforces.com/problemset/submit",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": body,
        "method": "POST",
        "mode": "cors"
    });
    
    let html = await res.text();

    // const fs = require("fs");
    // fs.writeFileSync("tmp.html", await res.text());

    if (html.includes("Memory") && html.includes("KB") && html.includes("status-cell")) {
        //success
        const submissions = await parseAllSubmissions(html);
        return submissions[0];
    } else {
        throw new Error('Unable to submit the code....');
    }
};


module.exports = submit;
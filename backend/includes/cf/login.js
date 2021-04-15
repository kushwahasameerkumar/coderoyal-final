const { fstat } = require("fs");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { parseTags } = require("./tag");

//returns cookie
const login = async () => {
    try {
        let html = await fetch("https://codeforces.com/enter?back=%2F");
        const cookies = html.headers.raw()['set-cookie'].map(cookie => {
            return cookie.split(";")[0];
        });
        html = await html.text();

        const tags = parseTags(html);
        // const params = new URLSearchParams();
        // params.append("csrf_token", tags.csrf);
        // params.append("action", "enter");
        // params.append("ftaa", tags.ftaa);
        // params.append("bfaa", tags.bfaa);
        // params.append("handleOrEmail", "221010amank@gmail.com");
        // params.append("password", "g!bBnAj?54F+HCi");
        // params.append("_tta", 374);

        html = await fetch("https://codeforces.com/enter?back=%2F", {
            "headers": {
              "content-type": "application/x-www-form-urlencoded",
              "cookie": cookies.join("; ")
            },
            "referrer": "https://codeforces.com/enter?back=%2F",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `csrf_token=${tags.csrf}&action=enter&ftaa=${tags.ftaa}&bfaa=${tags.bfaa}&handleOrEmail=221010amank%40gmail.com&password=g%21bBnAj%3F54F%2BHCi&_tta=374`,
            "method": "POST",
            "mode": "cors"
          });

        html = await html.text();
        tags.handle = html.split('handle = "')[1].split('";')[0];
        return tags;
    } catch (e) {
        console.log(e);
        throw new Error("Unable to login...");
    }
}


// login().then(console.log).catch(console.error);
module.exports = login;
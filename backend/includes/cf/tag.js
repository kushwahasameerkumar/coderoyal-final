const rs = require('randomstring');
const fetch = require("node-fetch");

const getTags = async () => {
    const tags = {
        csrf: null,
        ftaa: null,
        bfaa: null
    };

    let data = await fetch("https://codeforces.com");
    data = await data.text();

    tags.csrf = data.split('"X-Csrf-Token" content="')[1].split('"')[0];
    // tags.ftaa = data.split('_ftaa = "')[1].split('";')[0];
    tags.ftaa = rs.generate({
        length: 18,
        charset: 'alphanumeric'
    }).toLowerCase();
    tags.bfaa = '41fc280a17701859061d57c49b98eb88';
    // tags.bfaa = data.split("_bfaa = \"")[1].split('";')[0];

    return tags;
}

const parseTags = (data) => {
    const tags = {
        csrf: null,
        ftaa: null,
        bfaa: null
    };
    
    tags.csrf = data.split('"X-Csrf-Token" content="')[1].split('"')[0];
    // tags.ftaa = data.split('_ftaa = "')[1].split('";')[0];
    tags.ftaa = rs.generate({
        length: 18,
        charset: 'alphanumeric'
    }).toLowerCase();
    tags.bfaa = '41fc280a17701859061d57c49b98eb88';
    // tags.bfaa = data.split("_bfaa = \"")[1].split('";')[0];

    return tags;
}

module.exports = {getTags, parseTags};
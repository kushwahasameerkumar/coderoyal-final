// const {getProblemSet, getProblemHtml} = require('./problems');
const login = require("./login");

async function main() {
    try {
        // const problemHtml = await getProblemHtml(946, 'A');
        // return problemHtml;
        await login();
    } catch (e) {
        console.error(e);
    }
}

// async function main() {
//     try {
//         const problemSet = await getProblemSet(800, 800, 'C');
//         return problemSet;
//     } catch (e) {
//         console.error(e);
//     }
// }




main().then(console.log);
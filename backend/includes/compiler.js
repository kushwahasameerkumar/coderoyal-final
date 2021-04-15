const ws = require("ws");

function buildMsg(data) {
    return "42" + JSON.stringify(data);
}

async function Compiler(content) {
    this.content = content;
    this.status = null;
    this.socket = new ws(
        "wss://www.onlinegdb.com/socket.io/?client_version=1.1&uni=null&EIO=3&transport=websocket",
        {
            origin: "https://www.onlinegdb.com"
        }
    )

    this.socket.on("open", () => {
        console.log("Compiler: ", "ws connected");
        //keep-alive
        this.socket.send("2probe");
        // setInterval(function () {
        //     this.socket.send("2");
        // }.bind(this), 25000);
        //run content
        console.log("Compiler: ", "run");
        console.log("content: ", this.content);
        this.socket.send(buildMsg(["gui_event", "runcode"]));
        this.socket.send(buildMsg(["run", { "src": [{ "name": "main.cpp", "content": this.content }], "stdin": "", "lang": "c++", "cmd_line_args": "", "input_method": "interactive", "test_ass_id": null, "test": false, "graphics": null, "compiler_flags": "" }]));
    });

    return new Promise((resolve, reject) => {
        const messages = [];
        this.socket.on("message", (msg) => {
            console.log("Compiler: ", msg);
            if (msg.includes("42[\"")) {
                msg = msg.split("42[\"").join("[\"");
                msg = JSON.parse(msg);
                if (msg[0] == "compile_success") {
                    this.status = "success";
                }
                if (this.status == "success" && msg[0] == "message") {
                    // console.log("msg", msg[1]);
                    messages.push(msg[1]);
                }
                if (msg[0] == "console_exit") {
                    this.socket.close();
                    return resolve(messages);
                }
            }
        });
    });
}

// function Compiler() {
//     this.socket = new ws(
//         "wss://www.onlinegdb.com/socket.io/?client_version=1.1&uni=null&EIO=3&transport=websocket",
//         {
//             origin: "https://www.onlinegdb.com"
//         }
//     )

//     this.socket.on("open", () => {
//         console.log("Compiler: ", "ws connected");
//         //keep-alive
//         this.socket.send("2probe");
//         setInterval(function () {
//             this.socket.send("2");
//         }.bind(this), 25000);
//     })

//     this.socket.on("message", (msg) => {
//         console.log("Compiler: ", msg);
//     })
// }

// Compiler.prototype.run = function (content) {
//     console.log("Compiler: ", "run");
//     this.socket.send(buildMsg(["gui_event", "runcode"]));
//     this.socket.send(buildMsg(["run", { "src": [{ "name": "main.cpp", "content":  content}], "stdin": "", "lang": "c++", "cmd_line_args": "", "input_method": "interactive", "test_ass_id": null, "test": false, "graphics": null, "compiler_flags": "" }]));
// }

module.exports = Compiler;
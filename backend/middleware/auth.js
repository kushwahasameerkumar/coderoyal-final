const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const secret = process.env.ACCESS_TOKEN;
    let token = req.headers['authorization'].split(" ")[1];   //possible splitting erorr
    if (!token || token.length == 0) {
        return res.status(401).json({ success: false, msg: "Unauthorized request!" });
    }
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).json({ success: false, msg: "Unauthorized request!" });
        }
        req.auth = decoded;
        next();
    })
}

function socketAuth(socket, next) {
    const secret = process.env.ACCESS_TOKEN;
    if (socket.handshake.auth && socket.handshake.auth.token) {
        jwt.verify(socket.handshake.auth.token, secret, function (err, decoded) {
            if (err) {
                const er = new Error('auth_error');
                er.data = "Unauthorized request";
                next(er);
            }
            socket.auth = decoded;
            next();
        })
    } else {
        const er = new Error('auth_error');
        er.data = " Unauthorized request";
        next(er);
    }
}

module.exports = { auth, socketAuth };
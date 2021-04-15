const buildResponse = (status, msg = null, data = null) => {

    const res = {};
    //todo: handle different msg_types
    switch (status) {
        case 'success':
            res.status = 200
            res.msg = "SUCCESS"
                ;
        case 'failure':
            res.status = 500
            res.msg = "FAILURE"
                ;
    }
    if (msg) {
        res.msg = msg;
    }
    if (data) {
        res.data = data;
    }

    return res;
}

module.exports = buildResponse;
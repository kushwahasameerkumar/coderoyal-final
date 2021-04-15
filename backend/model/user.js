const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const Submission = require("./submission");

const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    username: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    fullName: { type: String },
    email: { type: String },
    handles: {
        codeforces: { type: String },
        codechef: { type: String },
        stopstalk: { type: String }
    },
    submissions: [{ type: ObjectId, ref: 'Submission' }],
    created_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model("User", userSchema);
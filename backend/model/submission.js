const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const User = require("./user");
const Match = require("./match");

const ObjectId = Schema.Types.ObjectId;

const submissionSchema = new Schema({
    submissionId: { type: String },
    language: { type: String },
    verdict: { type: String },
    problemId: { type: String },
    match: { type: ObjectId, ref: 'Match' },
    created_by: { type: ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);
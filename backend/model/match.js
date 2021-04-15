const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const User = require("./user");

const ObjectId = Schema.Types.ObjectId;

const matchSchema = new Schema({
    startTime: { type: Date },
    endTime: { type: Date },
    matchFormat: { type: String },
    problems: [{
        problemId: { type: String },
        problemName: { type: String },
        problemPoints: { type: Number },
        active: { type: Boolean, default: true }
    }],
    players: [{
        problemsSolved: [{ type: String }],
        player: { type: ObjectId, ref: 'User' }
    }],
    visibility: { type: String, default: 'PRIVATE' },
    created_by: { type: ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Match", matchSchema);
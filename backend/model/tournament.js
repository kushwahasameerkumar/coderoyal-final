const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const User = require("./user");
const Match = require("./match");

const ObjectId = Schema.Types.ObjectId;

const tournamentSchema = new Schema({
    title: { type: String },
    description: { type: String },
    tournamentFormat: { type: String },
    matches: [{ type: ObjectId, ref: 'Match' }],
    players: [{
        seedValue: { type: Number },
        player: { type: ObjectId, ref: 'User' }
    }],
    seedType: { type: String },
    admins: [{ type: ObjectId, ref: 'User' }],
    visibility: { type: String },
    created_by: { type: ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
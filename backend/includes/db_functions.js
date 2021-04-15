const path = require('path');
const Match = require(path.resolve('model', 'match.js'));

const getMatchPlayers = async(match_id) => {
    const match = await Match.findById(match_id).populate('players.player').exec(); //todo: handle error
    if (match && match.players) {
        return match.players.map(player => {
            return {
                _id: player.player._id,
                username: player.player.username
            };
        });
    }
    return [];
};

const insertMatchPlayer = async(match_id, user_id) => {
    const res = await Match.updateOne({ _id: match_id }, {
        $push: {
            players: { player: user_id }
        }
    }); //todo: ensure modified
};

const removeMatchPlayer = async(match_id, user_id) => {
    const res = await Match.updateMany({ _id: match_id }, {
        $pull: {
            players: { player: user_id }
        }
    }); //todo: ensure modified
};


module.exports = { getMatchPlayers, insertMatchPlayer, removeMatchPlayer }
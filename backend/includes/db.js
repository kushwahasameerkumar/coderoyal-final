const mongoose = require("mongoose");
require('dotenv').config();

const [username, password, db, cluster_url] = [process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.CLUSTER_URL];

function Database() { }

Database.prototype._connect = function () {
    mongoose.connect('mongodb+srv://'+username+':'+password+'@'+cluster_url+'/'+db+'?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Database connected successfully.");
        })
        .catch(err => {
            console.error("Database connection error!!!");
        });
}

module.exports = Database;

const { app } = require("electron");

const path = require("path");

module.exports = {
    gamesFolder: path.join(app.getPath("userData"), "Games")
}
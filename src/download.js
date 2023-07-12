const path = require("path")
const fs = require("fs/promises");

const downloadFile = async (url, destPath) => {
    const filename = url.split("/").pop();
    const destination = path.join(destPath, filename)

    try {
        await fs.access(destination, fs.constants.R_OK)
        // file exists, do nothing
    } catch (err) { // download file
        const res = await fetch(url);
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFile(destination, buf, err => {
            if (err) return console.error(err);
        })
    }
}

const downloadGame = async (id, gamesPath) => {
    const files = ["app.html", "app.js", "app.wasm", "app.data"];
    const gameUrl = `https://denki.co.uk/sky/${id}/`;
    const destPath = path.join(gamesPath, id);

    try {
        await fs.access(destPath, fs.constants.R_OK)
    } catch (err) {
        if (err.code === "ENOENT") {
            await fs.mkdir(destPath)
        }
    }

    await Promise.all(files.map(file => downloadFile(gameUrl + file, destPath)));
}

module.exports = {
    downloadFile, downloadGame
}

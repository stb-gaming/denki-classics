const fs = require("fs/promises");

const fileReadable = async (path) => {
    try {
        await fs.readFile(path);
        return true
    } catch (err) {
        return false;
    }
}

module.exports = { fileReadable }
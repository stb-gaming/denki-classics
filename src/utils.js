const fs = require("fs/promises");

const fileReadable = async (filePath) => {
    try {
        await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK)
        return true;
    } catch(err) {
        return false;
    }
}

module.exports = { fileReadable }
const fs = require("fs/promises");

const fileReadable = (filePath) => {
    let isReadable;
    fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK)
        .then(() => { isReadable = true; })
        .catch(err => { isReadable = false; });
    return isReadable;

}

module.exports = { fileReadable }
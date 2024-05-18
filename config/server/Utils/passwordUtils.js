const bcrypt = require("bcrypt");

function hashPassword(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function verifyPassword(enteredPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(enteredPassword, hashedPassword, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = {
    hashPassword,
    verifyPassword,
};

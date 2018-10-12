const env = require('node-env-file');
env(__dirname + '/.env');
const {
    EXPRESS_PORT,
} = process.env;

module.exports = {
    EXPRESS_PORT: EXPRESS_PORT || 4000,
};

const response = require('../service/response');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = async (req, res) => {
    fs.writeFileSync('../receive.log', JSON.stringify(req.body), { encoding: 'utf-8' });
    exec('git pull');
    res.send(response.message('success'));
};

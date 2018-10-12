const autoprefixer = require('autoprefixer')

module.exports = {
    plugins: [
        autoprefixer({
            browsers: [
                'iOS >= 7',
                'Android >= 4.1',
                'Firefox >= 20',
                'ie >= 9'
            ]
        })
    ]
}
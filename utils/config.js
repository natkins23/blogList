require('dotenv').config()

// destructured version of `const PORT = process.env.PORT`
const { PORT } = process.env
const { MONGODB_URI } = process.env

module.exports = {
    MONGODB_URI,
    PORT,
}

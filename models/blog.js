const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        unique: true,
    },
    author: {
        type: String,
        minlength: 3,
    },
    url: String,
    likes: Number,
    user: String,
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

blogSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Blog', blogSchema)

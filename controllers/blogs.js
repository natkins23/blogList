const blogRouter = require('express').Router() //
const Blog = require('../models/blog')

blogRouter.get('/', (req, res, next) => {
    Blog.find({})
        .then(persons => {
            res.json(persons.map(person => person.toJSON()))
        })
        .catch(error => next(error))
})

blogRouter.get('/:id', (req, res, next) => {
    Blog.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogRouter.post('/', (req, res, next) => {
    const { title, author, url, likes } = req.body
    if (title === undefined) {
        return res.status(400).json({ error: 'title missing' })
    }
    if (author === undefined) {
        return res.status(400).json({ error: 'author missing' })
    }
    if (url === undefined) {
        return res.status(400).json({ error: 'url missing' })
    }
    if (likes === undefined) {
        return res.status(400).json({ error: 'likes missing' })
    }
    const blog = new Blog(req.body)
    blog.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

blogRouter.delete('/:id', (req, res, next) => {
    Blog.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

blogRouter.put('/:id', (req, res, next) => {
    const { name, number } = req.body
    const person = { name, number }
    const opts = {
        new: true,
        runValidators: true,
        context: 'query',
    }
    Blog.findByIdAndUpdate(req.params.id, person, opts)
        .then(newPerson => {
            res.json(newPerson)
        })
        .catch(error => next(error))
})

module.exports = blogRouter

const blogRouter = require('express').Router() //
const Blog = require('../models/blog')

blogRouter.get('/', (req, res, next) => {
    Blog.find({})
        .then(blogs => {
            res.json(blogs.map(blog => blog.toJSON()))
        })
        .catch(error => next(error))
})

blogRouter.get('/:id', (req, res, next) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (blog) {
                res.json(blog)
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
        .then(savedBlog => {
            res.json(savedBlog)
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
    const { title, author, url, likes } = req.body
    const blog = { title, author, url, likes }
    const opts = {
        new: true,
        runValidators: true,
        context: 'query',
    }
    Blog.findByIdAndUpdate(req.params.id, blog, opts)
        .then(newBlog => {
            res.json(newBlog)
        })
        .catch(error => next(error))
})

module.exports = blogRouter

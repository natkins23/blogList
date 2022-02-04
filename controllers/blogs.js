const blogRouter = require('express').Router() //
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res, next) => {
    const blogs = await Blog.find({})
    try {
        res.json(blogs.map(blog => blog.toJSON()))
    } catch (exception) {
        next(exception)
    }
})
blogRouter.get('/:id', async (req, res, next) => {
    try {
        const specificBlog = await Blog.findById(req.params.id)
        if (specificBlog) {
            res.json(specificBlog.toJSON())
        } else {
            res.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

blogRouter.post('/', async (req, res, next) => {
    const blog = req.body
    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'missing title or url' })
    }
    if (!blog.author) {
        return res.status(400).json({ error: 'missing author' })
    }
    if (blog.likes === undefined) {
        blog.likes = 0
    }
    const newBlog = new Blog(blog)
    try {
        const savedBlog = await newBlog.save()
        res.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
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

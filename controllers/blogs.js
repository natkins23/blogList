const blogRouter = require('express').Router() //
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs.map(blog => blog.toJSON()))
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

blogRouter.post('/', async (req, res) => {
    const blog = req.body
    if (blog.title === undefined) {
        return res.status(400).json({ error: 'title missing' })
    }
    if (blog.author === undefined) {
        return res.status(400).json({ error: 'author missing' })
    }
    if (blog.url === undefined) {
        return res.status(400).json({ error: 'url missing' })
    }
    if (blog.likes === undefined) {
        blog.likes = 0
    }
    const newBlog = new Blog(blog)

    const savedBlog = await newBlog.save()

    res.status(201).json(savedBlog)
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

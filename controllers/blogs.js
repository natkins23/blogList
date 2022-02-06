const blogRouter = require('express').Router() //

const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs.map(blog => blog.toJSON()))
})
blogRouter.get('/:id', async (req, res) => {
    const specificBlog = await Blog.findById(req.params.id)
    if (specificBlog) {
        res.json(specificBlog.toJSON())
    } else {
        res.status(404).end()
    }
})

blogRouter.post('/', async (req, res) => {
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
    const savedBlog = await newBlog.save()
    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})
blogRouter.put('/:id', async (req, res) => {
    const { title, author, url, likes } = req.body
    const blog = { title, author, url, likes }
    const opts = {
        new: true,
        runValidators: true,
        context: 'query',
    }
    await Blog.findByIdAndUpdate(req.params.id, blog, opts)
    res.json(blog)
})

module.exports = blogRouter

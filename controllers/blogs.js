const blogRouter = require('express').Router() //
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('user', { username: 1, name: 1 })
    res.json(blogs)
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
    const { body } = req

    const decidedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decidedToken) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findOne({ id: decidedToken.id })
    const blog = new Blog({
        title: body.title,
        author: body.author,
        likes: body.likes,
        url: body.url,
        user: user._id,
    })

    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'missing title or url' })
    }
    if (!blog.author) {
        return res.status(400).json({ error: 'missing author' })
    }
    if (blog.likes === undefined) {
        blog.likes = 0
    }
    // test purposes
    if (!blog.user) {
        return res.status(400).json({ error: 'no users exist' })
    }

    const savedBlog = await blog.save()
    console.log(savedBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
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

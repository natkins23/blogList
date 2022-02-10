const blogRouter = require('express').Router() //
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')

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

blogRouter.post('/', userExtractor, async (req, res) => {
    const { body } = req
    const { user } = req
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

blogRouter.delete('/:id', userExtractor, async (req, res) => {
    const { user } = req
    const blog = await Blog.findById(req.params.id)
    if (blog.user.toString() !== user.id.toString()) {
        return res.status(401).json({ error: 'only the creator can delete blogs' })
    }
    await blog.remove()
    user.blogs = user.blogs.filter(b => b.toString() !== req.params.id.toString())
    await user.save()
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

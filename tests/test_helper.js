const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'How to become a front-end developer',
        author: 'Nathan Watkins',
        url: 'nathansnotions.io',
        likes: 52,
    },
    {
        title: 'Why trump is evil',
        author: 'Nancy Pelosi',
        url: 'cnn.com',
        likes: 1,
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'will be removed', author: 'doesnt exist', url: 'NA.org', likes: 0 })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
}

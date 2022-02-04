const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'test',
        url: 'test.org',
        likes: 69,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain('async/await simplifies making async calls')
})

test('blog without content is not added', async () => {
    const newBlog = {
        likes: 1337,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog uses id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.every(blog => blog.id)).toBeTruthy()
    expect(response.body.some(blog => blog._id)).toBeFalsy()
})

afterAll(() => {
    mongoose.connection.close()
})

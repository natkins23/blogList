const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObject = helper.initialBlogs.map(b => new Blog(b))
    const promiseArray = blogObject.map(b => b.save())
    await Promise.all(promiseArray)
})

describe('testing initial notes', () => {
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
    test('a specific blog exists', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(b => b.title)

        expect(titles).toContain('How to become a front-end developer')
    })
})
describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const blogs = await helper.blogsInDb()

        const response = await api
            .get(`/api/blogs/${blogs[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual(blogs[0])
    })

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()

        await api.get(`/api/blogs/${validNonExistingId}`).expect(404)
    })
})

describe('addition of new Blogs', () => {
    test('blog without content is not added', async () => {
        const newBlog = {
            likes: 1337,
        }

        await api.post('/api/blogs').send(newBlog).expect(400)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
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
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)

        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(contents).toContain('async/await simplifies making async calls')
    })
})

describe('Blogs structure', () => {
    test('blog uses id instead of _id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.every(blog => blog.id)).toBeTruthy()
        expect(response.body.some(blog => blog._id)).toBeFalsy()
    })

    test('blog likes default value is 0', async () => {
        const unlikedBlog = {
            title: 'no one likes me',
            author: 'amumu',
            url: 'suicide.org',
        }

        await api
            .post('/api/blogs')
            .send(unlikedBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/blogs')

        expect(res.body).toHaveLength(helper.initialBlogs.length + 1)
        const addedBlog = res.body.find(b => b.title === unlikedBlog.title)
        expect(addedBlog.likes).toBe(0)
    })

    test('operation fails with proper error if url and title are missing', async () => {
        const newBlog = {
            author: 'Rick Hanlon',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogListAtStart = await helper.blogsInDb()
        const firstBlogId = blogListAtStart[0].id
        await api.delete(`/api/blogs/${firstBlogId}`).expect(204)
        const blogListAfterDeletion = await helper.blogsInDb()
        expect(blogListAfterDeletion.length).toBe(helper.initialBlogs.length - 1)
    })
})

describe('edit blog post', () => {
    test('edit likes of a single post', async () => {
        const blogs = await helper.blogsInDb()
        const nancysPost = blogs.find(b => b.author === 'Nancy Pelosi')
        nancysPost.likes -= 1
        await api.put(`/api/blogs/${nancysPost.id}`).send(nancysPost).expect(200)
        const updatedBlogs = await helper.blogsInDb()
        expect(updatedBlogs[1].likes).toBe(0)
    })
})

describe('user tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', name: 'admin', passwordHash })

        await user.save()
    })

    test('create new user', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('get existing users', async () => {
        const users = await api.get('/api/users').expect('Content-Type', /application\/json/)
        expect(users.body[0].name).toBe('admin')
    })

    describe('invalid user tests', () => {
        test('user with no username', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                name: 'Matti Luukkainen',
                password: 'salainen',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
        test('user with no name', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'mluukkai',
                password: 'salainen',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
        test('username is too short', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: '12',
                name: 'Matti Luukkainen',
                password: 'salainen',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
        test('password is too short', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'mluukkai',
                name: 'Matti Luukkainen',
                password: '12',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
        test('username is not unique', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Matti Luukkainen',
                password: 'salainen',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})

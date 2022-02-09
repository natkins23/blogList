const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1 })

    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { password, username, name, blogs } = req.body

    if (!username) {
        return res.status(400).json({ error: 'invalid input: missing username' })
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'invalid input: username is less than three characters' })
    }
    if (!name) {
        return res.status(400).json({ error: 'invalid input: missing name' })
    }
    if (password.length < 3) {
        return res.status(400).json({ error: 'invalid input: password is less than three characters' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash,
        blogs,
    })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter

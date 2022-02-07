const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const { body } = req

    if (!body.username) {
        return res.status(400).json({ error: 'invalid input: missing username' })
    }
    if (body.username.length < 3) {
        return res.status(400).json({ error: 'invalid input: username is less than three characters' })
    }
    if (!body.name) {
        return res.status(400).json({ error: 'invalid input: missing name' })
    }
    if (body.password.length < 3) {
        return res.status(400).json({ error: 'invalid input: password is less than three characters' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})

    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter

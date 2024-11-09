const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

describe('adding new users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds appropriate username and password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = helper.initialUser

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with username or password with length < 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'aa',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
    const newUser2 = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'aa',
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)
      
      await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  // test('creation fails with proper statuscode and message if username already taken', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'root',
  //     name: 'Superuser',
  //     password: 'salainen',
  //   }

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)

  //   const usersAtEnd = await helper.usersInDb()
  //   assert(result.body.error.includes('expected `username` to be unique'))

  //   assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  // })
})

after(async () => {
  await mongoose.connection.close()
})
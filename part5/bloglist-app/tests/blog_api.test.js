const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('all blogs have the "id" property', async () => {

  const response = await api.get('/api/blogs')
  let verificator = true
  response.body.forEach((blog) => {
    const keys = Object.keys(blog)
    if(!keys.includes("id")){
      verificator = false
    }  
  })
  
  assert.strictEqual(verificator, true)
})

test('a valid blog can be added ', async () => {
  const newUser = helper.initialUser

  await api
  .post('/api/users')
  .send(newUser)

  const users = await api.get('/api/users')
  const firstUser = users.body[0] 

  const login = await api
  .post('/api/login')
  .send({username: helper.initialUser.username, password: helper.initialUser.password})

  const token = login.body.token

  const newBlog = {
    title: "blog test",
    author: "author name",
    url: "www.abc.com",
    likes: 10,
    user: firstUser.id
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('blog test'))
})

test('blog without "likes" property is added with default value of "0"', async () => {
  const newUser = helper.initialUser

  await api
  .post('/api/users')
  .send(newUser)

  const users = await api.get('/api/users')
  const firstUser = users.body[0] 

  const login = await api
  .post('/api/login')
  .send({username: helper.initialUser.username, password: helper.initialUser.password})

  const token = login.body.token

  const newBlog = {
    title: "blog without likes property",
    author: "some author",
    url: "www.aaaa.com",
    user: firstUser.id
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const lastBlogLikes = blogsAtEnd.slice(-1)[0].likes
  const lastBlogTitle = blogsAtEnd.slice(-1)[0].title
  
  assert.strictEqual(lastBlogTitle, "blog without likes property")
  assert.strictEqual(lastBlogLikes, 0)
})

test('blog without "title" or "author" property is not added', async () => {
  const newUser = helper.initialUser

  await api
  .post('/api/users')
  .send(newUser)

  const users = await api.get('/api/users')
  const firstUser = users.body[0] 

  const login = await api
  .post('/api/login')
  .send({username: helper.initialUser.username, password: helper.initialUser.password})

  const token = login.body.token

  const badRequestBlogs = [
    {
    title: "blog without url property",
    author: "author1",
    user: firstUser.id
    },
    {
      author: "author2",
      url: "www.notitle.com",
      user: firstUser.id
    }
  ]
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(badRequestBlogs[0])
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(badRequestBlogs[1])
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
  
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('update a blog', async () => {
  const newBlog = {
    likes: 20
  }

  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)
    
  const blogsAtEnd = await helper.blogsInDb()

  assert.deepStrictEqual(blogsAtEnd[0], { ...blogsAtStart[0], likes: 20 })
})

test('delete a blog', async () => {
  const newUser = helper.initialUser

  await api
  .post('/api/users')
  .send(newUser)

  const users = await api.get('/api/users')

  const firstUser = users.body[0] 
  
  const login = await api
  .post('/api/login')
  .send({username: helper.initialUser.username, password: helper.initialUser.password})

  const token = login.body.token

  const newBlog = {
    title: "test blog to delete",
    author: "Fabian Rivero",
    url: "www.example.com",
    user: firstUser.id
  }  

  await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)

  const blogs = await api.get('/api/blogs')
  const selectedBlog = blogs.body[2]

  await api
    .delete(`/api/blogs/${selectedBlog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(selectedBlog.title))
})

test('a blog without a token returns status 401 "Unauthorized"', async () => {
  const newBlog = {
    title: "blog without token",
    author: "Fabian Rivero",
    url: "www.example.com",
  } 

  const blogsAtStart = await helper.blogsInDb()

  await api
    .post(`/api/blogs/`)
    .send(newBlog)
    .expect(401)
    
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


after(async () => {
    await mongoose.connection.close()
  })
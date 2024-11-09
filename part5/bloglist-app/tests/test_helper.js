const Blog = require('../models/blog')
const User = require('../models/user')

const initialUser = {
  username: 'fabianRivero',
  name: 'Fabian Rivero',
  password: 'password'
}

const initialBlogs = [
  {
    title: "First blog",
    author: "Fabian",
    url: "www.example.com",
    likes: 5
  },
  {
    title: "Another blog",
    author: "Pablo",
    url: "www.anotherexample.com",
    likes: 10
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUser, blogsInDb, usersInDb
}
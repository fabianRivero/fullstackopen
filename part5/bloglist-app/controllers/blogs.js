const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const middleware = require("../utils/middleware")


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  })

  blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id.toString()
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  })

  blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  
  })
  
  blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    
    const user = request.user

    const userBlogs = user.blogs.map(user => user._id.toString()) 

    if(userBlogs.includes(request.params.id)){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
  })
  
  blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
    const body = request.body    

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
    if(updatedBlog){
      response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
  })
  
module.exports = blogsRouter
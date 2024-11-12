import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable' 
import BlogForm from './components/BlogForm'

const App = () => {

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [notification, setNotification] =  useState(null)
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    async function initialBlogs() {
      const blogs = await blogService.getAll()
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( sortedBlogs ) 
    }
    initialBlogs()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()  
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification("wrong username or password")
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      }
    }

    const handleLogout = async (event) => {
      event.preventDefault()  
      try {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      } catch (exception) {
        setNotification("something went wrong")
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        }
    }

    const addBlog = async(blogObject) => {
      if (window.localStorage.getItem('loggedBlogappUser')) {
        const returnedBlog = await blogService.createNewBlog(blogObject)
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`A new blog "${blogObject.title}" by ${blogObject.author} added.`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } else{
        setNotification("please log in again")
        setUser(null)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    }

    const giveLike = async (blog, likes) => {
      const newBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: likes + 1
      }
      await blogService.updateBlog(blog.id, newBlog)
      const newBlogs = await blogService.getAll()
      const sortedBlogs = await newBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs( sortedBlogs ) 
    }
    
    const removeBLog = async (blog) => {
      const confirmacion = window.confirm(`Remove blog: ${blog.title} by ${blog.author}?`)
      if (confirmacion) {
        await blogService.deleteBlog(blog.id)
        const newBlogs = await blogService.getAll()
        const sortedBlogs = await newBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs( sortedBlogs )
      } else {
        return null 
      }

    } 

  return (
    <>
        <Notification message={notification}/>
    <div>
      {
      user !== null 
      ?
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>log out</button>
        <h2>blogs</h2>
      <div>
        <div>
          <Togglable buttonLabel={'New blog'}>
            <BlogForm createBlog={addBlog}/>
          </Togglable>
        </div>
        
      </div>
        {
        blogs.map(blog => blog)
        .map((blog) => <Blog key={blog.id} blog={blog} user={user} likeFunction={giveLike} removeFunction={removeBLog}/>)
        }
      </div>
      :
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}> 
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          </div>
          <button type="submit">login</button>
        </form>      
      </div>
    
    }   
    </div>
    </>
  )
}

export default App
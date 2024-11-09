import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [notification, setNotification] =  useState(null)
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


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
      setBlogs( blogs ) 
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
    const addBlog = async(event) => {
      event.preventDefault()
      if (window.localStorage.getItem('loggedBlogappUser')) {
        const blogObject = {
          title: title,
          author: author,
          url: url,
        }
        const returnedBlog = await blogService.createNewBlog(blogObject)
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setNotification(`A new blog "${blogObject.title}" by ${blogObject.author} added.`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } else{
        setNotification("please log in again")
        setTitle('')
        setAuthor('')
        setUrl('')
        setUser(null)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
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
        <h2>blogs</h2>
        <div>
        {user.name} logged in
        <button onClick={handleLogout}>log out</button>
        
        <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
        <div>title:<input type="text" value={title} name='Title' onChange={({target}) => setTitle(target.value)}/></div>
        <div>author:<input type="text" value={author} name='Author' onChange={({target}) => setAuthor(target.value)}/></div>
        <div>url:<input type="text" value={url} name='Url' onChange={({target}) => setUrl(target.value)}/></div>
        <button type="submit">create</button>
        </form>
        </div>
        
        </div>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
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
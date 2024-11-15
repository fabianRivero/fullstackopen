import { useState } from "react"

const Blog = ({ blog, user, likeFunction, removeFunction }) => {
  const [visible, setVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState("view")
  const [likes, setLikes] = useState(blog.likes)
  const [removeButtonStyle, setRemoveButtonStyle] = useState({display: "none"})

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const decodeToken = (token) => {
        
    const arrayToken = token.split('.')
    const tokenPayload = JSON.parse(atob(arrayToken[1]))
    return tokenPayload
}

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = async () => {
    setVisible(!visible)
    const label = visible ?
    "view":
    "hide"
    setButtonLabel(label)  
    
    const token = user.token

    const decoded = decodeToken(token)

    if(blog.user.username){
      blog.user.username === user.username
      ?
      setRemoveButtonStyle({display:""})
      :
      setRemoveButtonStyle({display:"none"})
    } else if(decoded.id && typeof(blog.user) === "string"){
      blog.user === decoded.id
      ?
      setRemoveButtonStyle({display:""})
      :
      setRemoveButtonStyle({display:"none"})
    }

  }

  const giveLike = async () => {
    await likeFunction(blog, likes)
    setLikes(likes + 1)
  }
  
  const removeBlog = async () => {
    await removeFunction(blog)
  }


  return(
  <li className="blog" style={blogStyle}>
    <div data-testid='newBlog'>
    {blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonLabel}</button>
      <div id="togglable-part" style={showWhenVisible}>
        <div>{blog.url}</div>
        <div data-testid='likeBlog'>Likes:{blog.likes}<button onClick={giveLike}>Like</button></div>
        <div>{user.name}</div>
        <button style={removeButtonStyle} onClick={removeBlog}>remove</button>
      </div>
    </div>
  </li>
  )
}

export default Blog
import { useState, useEffect } from "react"

const Blog = ({ blog, user, likeFunction, removeFunction }) => {
  const [visible, setVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState("view")
  const [likes, setLikes] = useState(null)

  useEffect(() => {
    async function initialLikes() {
      const likes = await blog.likes
      setLikes( likes ) 
    }
    initialLikes()
  }, [])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = async () => {
    setVisible(!visible)
    const label = visible ?
    "view":
    "hide"
    setButtonLabel(label)  
  }

  const removeButtonStyle = blog.user.username === user.username
  ?
  {display:""}
  :
  {display:"none"}

  const giveLike = async () => {
    await likeFunction(blog, likes)
    setLikes(likes + 1)
  }
  const removeBlog = async () => {
    await removeFunction(blog)
  }

  return(
  <div style={blogStyle}>
    <div>
    {blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonLabel}</button>
    </div>
    <div style={showWhenVisible}>
      <div>{blog.url}</div>
      <div>Likes:{likes}<button onClick={giveLike}>Like</button></div>
      <div>{user.name}</div>
      <button style={removeButtonStyle} onClick={removeBlog}>remove</button>
    </div>
  </div>
  )
}

export default Blog
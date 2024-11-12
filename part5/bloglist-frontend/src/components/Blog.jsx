import { useState, useEffect } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, user, func }) => {
  const [visible, setVisible] = useState(false)
  const [bottomLabel, setBottomLabel] = useState("view")
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

  const toggleVisibility = () => {
    setVisible(!visible)
    const label = visible ?
    "view":
    "hide"
    setBottomLabel(label)
  }

  const giveLike = async () => {
    func(blog, likes)
    setLikes(likes + 1)
  }

  return(
  <div style={blogStyle}>
    <div>
    {blog.title} {blog.author} <button onClick={toggleVisibility}>{bottomLabel}</button>
    </div>
    <div style={showWhenVisible}>
      <div>{blog.url}</div>
      <div>Likes:{likes}<button onClick={giveLike}>Like</button></div>
      <div>{user.name}</div>
    </div>
  </div>
  )
}

export default Blog
import { useState } from "react"

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
          title: title,
          author: author,
          url: url
        })
    
        setTitle('')
        setAuthor('')
        setUrl('')
      }

    return(
        <div className="formDiv">
            <h2>create new</h2>
            <form onSubmit={addBlog}>
            <div>title:<input data-testid='title' id='title-input' type="text" value={title} name='Title' onChange={({target}) => setTitle(target.value)}/></div>
            <div>author:<input data-testid='author' id='author-input' type="text" value={author} name='Author' onChange={({target}) => setAuthor(target.value)}/></div>
            <div>url:<input data-testid='url' id='url-input' type="text" value={url} name='Url' onChange={({target}) => setUrl(target.value)}/></div>
            <button type="submit">create</button>
            </form>
        </div>
    )    
}

export default BlogForm
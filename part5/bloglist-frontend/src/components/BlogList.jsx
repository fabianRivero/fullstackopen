import Blog from './Blog'

const BlogList = ((props) => {

    return(
        props.blogs.map(blog => blog).sort((a, b) => b.likes - a.likes)
        .map((blog) => <Blog key={blog.id} blog={blog} user={user}/>)    
    )
 
})

export default BlogList
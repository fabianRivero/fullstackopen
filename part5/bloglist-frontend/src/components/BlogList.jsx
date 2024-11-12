import { useState, forwardRef, useImperativeHandle } from 'react'
import Blog from './Blog'

const BlogList = ((props, refs) => {
    console.log("props", props)
    console.log("refs", refs)

    return(
        props.blogs.map(blog => blog).sort((a, b) => b.likes - a.likes)
        .map((blog) => <Blog key={blog.id} blog={blog} user={user}/>)    
    )
 
})

export default BlogList
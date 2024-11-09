const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    
    const sum = blogs.length === 0 
    ? undefined 
    :   
    blogs.reduce((acummulator, blog) => {
        return acummulator + blog.likes
    }, 0)
    return sum
}

const favoriteBlog = (blogs) => {
    
    const maxNumber = blogs.length === 0 
    ? undefined 
    :   
    blogs.reduce((acummulator, blog) => {
        const max = blog.likes >= acummulator
        ?
        blog.likes
        :
        acummulator
        return max
    }, 0)

    const favorite = blogs.find(blog => blog.likes === maxNumber)
    return favorite
}

const mostBlogs = (blogs) => {
    const authorCount = lodash.countBy(blogs, 'author')
    const [key, maxValue] = Object.entries(authorCount).reduce(
        (max, actual) => actual[1] >= max[1] ? actual : max
    )
    const result = blogs.length === 0 
    ? undefined 
    :
    {author: key, blogs: maxValue}
    
    return result
}

const mostlikes = (blogs) => {
    const groupByAuthor = lodash.groupBy(blogs, 'author')

    const likesByAuthor = lodash.mapValues(
        groupByAuthor,
        authorBlogs => lodash.sumBy(authorBlogs, 'likes')
    )
    const [key, maxValue] = Object.entries(likesByAuthor).reduce(
        (max, actual) => actual[1] >= max[1] ? actual : max
    )

    const result = blogs.length === 0 
    ? undefined 
    :
    {author: key, likes: maxValue}

    return result
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostlikes
  }


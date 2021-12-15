const dummy = () => 1

const totalLikes = blogList => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue
    return blogList.map(blogs => blogs.likes).reduce(reducer, 0)
}

const findFavoriteBlog = blogList => {
    const arrayOfLikes = blogList.map(blog => blog.likes)
    if (arrayOfLikes.length === 0) {
        return 'no favorite blog'
    }
    const largestLike = Math.max(...arrayOfLikes)
    const favoriteBlog = blogList.find(blog => blog.likes === largestLike)
    delete favoriteBlog._id
    delete favoriteBlog.__v
    delete favoriteBlog.url
    return favoriteBlog
}

module.exports = {
    dummy,
    totalLikes,
    findFavoriteBlog,
}

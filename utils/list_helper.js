const dummy = () => 1

const totalLikes = blogList => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue
    return blogList.map(blogs => blogs.likes).reduce(reducer, 0)
}

module.exports = {
    dummy,
    totalLikes,
}

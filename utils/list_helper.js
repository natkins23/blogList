const _ = require('lodash')

const dummy = () => 1

const totalLikes = blogList => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue
    return blogList.map(blogs => blogs.likes).reduce(reducer, 0)
}
// my favorite blog function
const findFavoriteBlog = blogList => {
    const arrayOfLikes = blogList.map(blog => blog.likes)
    if (arrayOfLikes.length === 0) {
        return 'no favorite blog'
    }
    const largestLike = Math.max(...arrayOfLikes)
    const favoriteBlog = blogList.find(blog => blog.likes === largestLike)
    const result = { ...favoriteBlog }
    delete result._id
    delete result.__v
    delete result.url
    return result
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }

    const withMostVotes = (best, current) => {
        if (!best) {
            return current
        }

        return best.likes > current.likes ? best : current
    }

    const mostPopular = blogs.reduce(withMostVotes, null)
    const result = { ...mostPopular }
    delete result._id
    delete result.__v
    delete result.url
    return result
}

// their favorite blog function

// my version
const mostBlogs = blogList => {
    const allBlogsAuthors = blogList.map(blog => blog.author)
    const UniqueAuthorsArr = _.sortedUniq(allBlogsAuthors)
    const authorBlogCount = UniqueAuthorsArr.map(author => {
        let total = 0
        allBlogsAuthors.forEach(nonUniqueAuthor => {
            if (nonUniqueAuthor === author) {
                total += 1
            }
        })
        return total
    })
    const largestBlogCount = _.max(authorBlogCount)
    const indexOfMostBlogAuthor = _.indexOf(authorBlogCount, largestBlogCount)
    const result = { author: UniqueAuthorsArr[indexOfMostBlogAuthor], blogs: largestBlogCount }
    return result
}

const otherMostBlogs = blogList => {
    if (blogList.length === 0) {
        return null
    }

    const blogsByAuthor = _.toPairs(_.groupBy(blogList, b => b.author))
    const blockCountByAuthor = blogsByAuthor
        .map(([author, blogs]) => ({
            author,
            blogs: blogs.length,
        }))
        .sort((a1, a2) => a2.blogs - a1.blogs)

    return blockCountByAuthor[0]
}

const mostLikedAuthor = blogList => {
    if (blogList.length === 0) {
        return null
    }
    const blogsByAuthor = _.toPairs(_.groupBy(blogList, b => b.likes))
    console.log(blogsByAuthor)
}

const theirMostLikedAuthor = blogList => {
    if (blogList.length === 0) {
        return null
    }

    const blogsByAuthor = _.toPairs(_.groupBy(blogList, b => b.author))
    const likeCountByAuthor = blogsByAuthor
        .map(([author, blogs]) => ({
            author,
            likes: blogs.reduce((s, b) => s + b.likes, 0),
        }))
        .sort((a1, a2) => a2.likes - a1.likes)

    return likeCountByAuthor[0]
}

module.exports = {
    dummy,
    totalLikes,
    findFavoriteBlog,
    mostBlogs,
    otherMostBlogs,
    favoriteBlog,
    mostLikedAuthor,
    theirMostLikedAuthor,
}

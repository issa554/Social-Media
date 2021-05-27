const postReso = require("./post")
const userRes = require('./user')
const commentsRes = require('./comments')

module.exports ={
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
      },
    Query:{
        ...postReso.Query
    },
    Mutation:{
        ...userRes.Mutation,
        ...postReso.Mutation,
        ...commentsRes.Mutation
    },
    Subscription: {
        ...postReso.Subscription
      }
}
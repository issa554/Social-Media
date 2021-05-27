const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getPosts() {
          try {
            const posts = await Post.find().sort({createdAt: -1})
            return posts;
          } catch (err) {
            throw new Error(err);
          }
        },
        async getPost(_,{postid}){
          try {
            const post = await Post.findById(postid);
            if (post) {
              return post;
            } else {
              throw new Error('Post not found');
            }
          } catch (err) {
            throw new Error(err);
          }
        }},
        Mutation:{
          async createPost(_, { body , imgUrl }, context) {
            const user = checkAuth(context);
      
            if (body.trim() === '') {
              throw new Error('Post body must not be empty');
            }
      
            const newPost = new Post({
              body,
              user: user.id,
              imgUrl,
              username: user.username,
              createdAt: new Date().toISOString()
            });
            const post = await newPost.save();
            return post;
          },
          async deletePost(_,{postid},context){
            try {
            const user = checkAuth(context);
            const post = await Post.findById(postid)
            if(user.username === post.username){
              post.delete();
              return  "oo"
            }else{
            
             throw new AuthenticationError("not allwoad")
            }
          } catch (error) {
             throw new Error(error)
          }
          },
          async likePost(_,{postid},context){
            const {username} = checkAuth(context)
            const post =await Post.findById(postid);
            if (post) {
              if (post.likes.find((like) => like.username === username)) {
                // Post already likes, unlike it
                post.likes = post.likes.filter((like) => like.username !== username);
              } else {
                // Not liked, like post
                post.likes.push({
                  username,
                  createdAt: new Date().toISOString()
                });
              }
      
              await post.save();
              return post;
            } else throw new UserInputError('Post not found');
          }
        },
        Subscription: {
          newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
          }
        }
        }
      

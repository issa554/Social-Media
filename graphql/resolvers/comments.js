const {UserInputError , AuthenticationError} = require("apollo-server")
const checkAuth = require("../../util/check-auth")
const Post = require('../../models/Post')

module.exports = {
    Mutation:{
        createComment: async (_, { postid, body }, context) => {
            const { username } = checkAuth(context);
            if (body.trim() === '') {
              throw new UserInputError('Empty comment', {
                errors: {
                  body: 'Comment body must not empty'
                }
              });
            }
      
            const post = await Post.findById(postid);
      
            if (post) {
              post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString()
              });
              await post.save();
              return post;
            } else throw new UserInputError('Post not found');
          },
        deleteComment : async (_,{postid , commentid},context)=>{
       const {username} = checkAuth(context)
       const post = await Post.findById(postid)
        
       if(post){
           const commentIndex = post.comments.findIndex(c=> c.id === commentid);
           if(post.comments[commentIndex].username === username){
               post.comments.splice(commentIndex,1);
               await post.save();
               return post;
           }
           else{
             throw new AuthenticationError('not allowed ')
           }
       }else{
           throw new UserInputError('post not found')
       }
        }
    }
}
const {gql} = require('apollo-server');


 module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    imgUrl:String
    comments:[comment]!
    likes:[like]!
    likeCount: Int!
    commentCount: Int!
  }
  type comment{
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type like{
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    createdAt: String!
    username: String!
    token:String!
  }
  input RegisterInput {
    username:String!
    password:String!
    confirmPassword:String!
    email:String!
  }
  type Query {
    getPosts: [Post]
    getPost(postid:ID!) : Post!
  }
  type Mutation {
    register(registerInput : RegisterInput) : User!
    login(username:String! , password:String!) : User!
    createPost(body:String!, imgUrl:String ) : Post!
    deletePost(postid:ID!) : String!
    createComment(postid: String!, body: String!): Post!
    deleteComment(postid:String! ,commentid:String!):Post!
    likePost(postid:String!):Post!
  }
  type Subscription {
    newPost: Post!
  }
`;



  const { ApolloServer ,PubSub } = require('apollo-server');
  const mongoose = require('mongoose');
  const typeDefs = require('./graphql/typeDefs')
  const resolvers = require('./graphql/resolvers/index')
  require('dotenv').config()
  
const pubsub = new PubSub();
 
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req  , pubsub})
  });
  //TODO: fevjbfdvfsv
  
  mongoose
    .connect( process.env.MONGO_DB, { useNewUrlParser: true })
    .then(() => {
      console.log('MongoDB Connected');
      return server.listen({ port: 5000 });
    })
    .then((res) => {
      console.log(`Server running at ${res.url}`);
    });
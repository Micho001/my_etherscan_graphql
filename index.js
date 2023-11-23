// import required modules
const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const EtherDataSource = require("./datasource/ethDatasource");

// import the schema.graphql file and parse it into a schema object
const typeDefs = importSchema("./schema.graphql"); 

// load environment variables from the .env file
require("dotenv").config();

// define the resolvers for the queries defined in the schema
const resolvers = {
  Query: {
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }), 
});

// Set timeout to 0 to disable
server.timeout = 0;

// Start the server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});

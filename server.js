import { ApolloServer, gql } from 'apollo-server';

let tweets = [
  {
    id: '1',
    text: 'Hello World',
    userId: '2',
  },
  {
    id: '2',
    text: 'Bye World',
    userId: '1',
  },
];

let users = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: '2',
    firstName: 'Tom',
    lastName: 'Paul',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }

  type Mutation {
    postTweet(text: String, userId: ID!): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    allUsers: () => users,
    allTweets: () => tweets,
    tweet(root, { id }) {
      return tweets.find(tweet => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const tweet = {
        id: String(tweets.length + 1),
        text,
      };
      const currentUser = users.find(user => user.id === userId);
      if (!currentUser) return; // or throw an error

      tweets.push(tweet);
      return tweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find(tweet => tweet.id === id);
      if (!tweet) return false;

      tweets = tweets.filter(tweet => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id == userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

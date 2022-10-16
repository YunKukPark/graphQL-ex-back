import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';

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
  type Query {
    allMovies: [Movie!]!
    movie(id: String!): Movie
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is sum of fistName and lastName
    """
    fullName: String!
  }
  """
  A tweet is a message posted on twitter
  """
  type Tweet {
    id: ID!
    text: String
    author: User
  }

  type Mutation {
    postTweet(text: String, userId: ID!): Tweet
    deleteTweet(id: ID): Boolean
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allMovies() {
      return fetch('https://yts.mx/api/v2/list_movies.json')
        .then(res => res.json())
        .then(json => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then(res => res.json())
        .then(json => json.data.movie);
    },
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

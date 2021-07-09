const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    input userInput {
        name: String!
        email: String!
        password : String!
    }

    input credentials {
        email: String!
        password: String!
    }

    input postInput {
        title: String!
        content: String!
        imageURL: String
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        posts: [Post]!
    }

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageURL: String
        userId: User!
        createdAt: String!
        updatedAt: String!
    }

    type Auth {
        token: String!
        userId: String!
    }

    type Query {
        hello: String!
    }

    type Mutation {
        register(userInput: userInput): User!
        login(credentials: credentials): Auth!
        createPost(postInput: postInput) : Post!

    }

    schema {
        query : Query
        mutation: Mutation
    }
`);
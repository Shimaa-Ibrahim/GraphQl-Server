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

    input commentInput {
        content: String!
        PostId: ID!
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
        likes: [User]!
        comments: [Comment]!
        createdAt: String!
        updatedAt: String!
    }

    type Comment {
        _id: ID!
        content: String!
        userId: User!
        postId: Post!
        createdAt: String!
        updatedAt: String!
    }

    type Auth {
        token: String!
        userId: String!
    }

    type Query {
        getPosts: [Post!]!
    }

    type Mutation {
        register(userInput: userInput): User!
        login(credentials: credentials): Auth!
        createPost(postInput: postInput) : Post!
        addComment(commentInput: commentInput) : Comment!
    }

    schema {
        query : Query
        mutation: Mutation
    }
`);
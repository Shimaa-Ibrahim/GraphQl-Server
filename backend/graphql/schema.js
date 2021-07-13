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
    }

    input commentInput {
        content: String!
        postId: ID!
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
        posts: [Post!]!
        post(id: ID): Post!
    }

    type Mutation {
        register(userInput: userInput): User!
        login(credentials: credentials): Auth!
        createPost(postInput: postInput) : Post!
        updatePost(id:ID, postInput: postInput) : Post!
        deletePost(id:ID) : Post!
        toggleLike(id:ID): Post!
        addComment(commentInput: commentInput) : Comment!
        updateComment(id:ID, commentInput: commentInput) : Comment!
        deleteComment(id:ID): Comment!
    }

    schema {
        query : Query
        mutation: Mutation
    }
`);
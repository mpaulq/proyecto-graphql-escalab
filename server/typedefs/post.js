const { gql } = require('apollo-server-express');

module.exports = gql`
    type Post {
        _id: ID!
        content: String
        image: Image
        postedBy: User
    }
    type PageInfo {
        posts: [Post!]!
        totalCount: Int!
    }
    # input type
    input PostCreateInput {
        content: String!
        image: ImageInput
    }
    # input type
    input PostUpdateInput {
        _id: ID!
        content: String
        image: ImageInput
    }
    type Query {
        allPosts: [Post!]!
        postsByUser: [Post!]!
        postById(id: ID): [Post!]!
        postsByPage(page: Int): PageInfo!
        postsSearch(content: String): [Post!]!
    }
    # mutations
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
        postUpdate(input: PostUpdateInput!): Post!
        postDelete(id: ID): Boolean
    }
`;
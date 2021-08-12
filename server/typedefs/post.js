const { gql } = require('apollo-server-express');

module.exports = gql`
    type Post {
        _id: ID!
        content: String
        image: Image
        postedBy: User
    }
    type PageInfo {
        page: Int!
        limit: Int!
        totalCount: Int!
        posts: [Post!]!
    }
    # input type
    input PostCreateInput {
        content: String!
        image: ImageInput
    }
    # input type
    input PostUpdateInput {
        id: ID!
        content: String
        image: ImageInput
    }
    # input type
    input PostPaginateInput {
        page: Int!
        limit: Int!
    }
    type Query {
        allPosts: [Post!]!
        postsByUser: [Post!]!
        postById(id: ID): Post!
        postsByPage(input: PostPaginateInput): PageInfo!
        postsSearch(content: String): [Post!]
    }
    # mutations
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
        postUpdate(input: PostUpdateInput!): Post!
        postDelete(id: ID!): Post
    }
`;
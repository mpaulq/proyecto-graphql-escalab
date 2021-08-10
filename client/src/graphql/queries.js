import { gql } from 'apollo-boost';
import { USER_INFO, POST_DATA } from './fragments';

export const ALL_USERS = gql`
    query {
        allUsers {
            ...userInfo
        }
    }
    ${USER_INFO}
`;

export const PROFILE = gql`
    query {
        profile {
            ...userInfo
        }
    }
    ${USER_INFO}
`;

export const PUBLIC_PROFILE = gql`
    query publicProfile($username: String!) {
        publicProfile(username: $username) {
            _id
            username
            name
            email
            images {
                url
                public_id
            }
            about
        }
    }
`;

export const GET_ALL_POSTS = gql`
    {
        allPosts {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const POSTS_BY_USER = gql`
    query {
        postsByUser {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const POST_BY_ID = gql`
    query postById ($id: ID!) {
        postById (id: $id) {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const POST_PAGINATION = gql`
    query postsByPage($page: Int) {
        postsByPage(page: $page) {
            posts {
                ...postData
            }
            totalCount
        }
    }
    ${POST_DATA}
`;

export const POSTS_SEARCH = gql`
    query postsSearch($content: String) {
        postsSearch(content: $content) {
            ...postData
        }
    }
    ${POST_DATA}
`;
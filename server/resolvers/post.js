// const { posts } = require('../temp');
const { authCheck } = require('../helpers/auth');
const Post = require('../models/post');
const User = require('../models/user');

// queries generic
const allPosts = async (parent, args) => {
    return await Post.find({})
    .populate("postedBy", "_id username")
    .sort({ createdAt: -1 })
    .exec();
};

const postsByUser = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    const currentUserFromDB = await User.findOne({
        email: currentUser.email,
    }).exec();

    return await Post.find({ postedBy: currentUserFromDB })
        .populate("postedBy", "_id username")
        .sort({ createdAt: -1 });
};
// const totalPosts = () => posts.length;
// const allPosts = () => posts;

// mutation
const postCreate = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    // validation
    if (args.input.content.trim() === "") throw new Error("Content is required");

    const currentUserFromDB = await User.findOne({
        email: currentUser.email,
    });
    let newPost = await new Post({
        ...args.input,
        postedBy: currentUserFromDB._id,
    })
        .save()
        .then((post) => post.populate("postedBy", "_id username").execPopulate());

    return newPost;
};

// const newPost = (parent, args) => {
//     console.log('argumentos nuevo post', args);

//     const post = {
//         id: posts.length + 1,
//         ...args.input
//     };
//     // push new post object to post array
//     posts.push(post);
//     return post;
// };

module.exports = {
    Query: {
        allPosts,
        postsByUser,
    },
    Mutation: {
        postCreate
    }
}
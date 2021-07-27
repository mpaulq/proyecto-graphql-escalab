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

const postById = async (_, args, { req }) => {
    return await Post.findById(args.id).exec();
};

const postsByPage = async (_, args, { req }) => {
    // default 10 elements per page
    const limit = 10;
    const page = args.page;
    const totalPosts = await Post.countDocuments();

    const filteredPosts = await Post
        .find({}, {skip: limit*page, limit: limit})
        .populate("postedBy", "_id username")
        .exec();
    
    return {
        posts: filteredPosts,
        totalCount: totalPosts
    }
}

const postsSearch = async (_, args, { req }) => {
    return await Post
        .find({content: {$regex: args.content, $options: "i"}})
        .populate("postedBy", "_id username")
        .exec()
}
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

const postUpdate = async (_, args, { req }) => {
    const post = await Post.findByIdAndUpdate(args.input._id, {
        ...args.input
    }, {new: true});

    return post;
}

const postDelete = async (_, args, { req }) => {
    const { _id, ...rest } = args.input;
    const post = await Post.findByIdAndDelete(_id, {
        ...rest
    }, {new: true});

    return post;
}

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
        postById,
        postsByPage,
    },
    Mutation: {
        postCreate,
        postUpdate,
        postDelete,
    }
}
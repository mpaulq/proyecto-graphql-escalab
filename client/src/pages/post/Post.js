import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';
import FileUpload from '../../components/FileUpload';
import { POST_CREATE, POST_DELETE } from '../../graphql/mutations';
import { POSTS_BY_USER } from '../../graphql/queries';
import PostCard from '../../components/PostCard';
import { Link } from 'react-router-dom';

const initialState = {
    content: "",
    image: {
        url: "https://via.placeholder.com/200x200.png?text=Post",
        public_id: "123"
    }
};

const Post = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);

    // query
    const { data: posts } = useQuery(POSTS_BY_USER);
    // destruct
    const { content } = values;

    // mutation
    const [ postCreate ] = useMutation(POST_CREATE, {
        // read query from cache / write query to cache
        update: (cache, { data: { postCreate }}) => {
            // read query from cache
            const { postsByUser } = cache.readQuery({
                query: POSTS_BY_USER
            });
            // write query to cache
            cache.writeQuery({
                query: POSTS_BY_USER,
                data: {
                    postsByUser: [postCreate, ...postsByUser]
                }
            });
        },
            onError: (err) => console.log(err.graphQLError[0].message)
    });
    const [ postDelete ] = useMutation(POST_DELETE, {
        update: (cache, { data: { postDelete } }) => {
            const { postsByUser } = cache.readQuery({
                query: POSTS_BY_USER
            });
            cache.writeQuery({
                query: POSTS_BY_USER,
                data: {
                    postsByUser: postsByUser.filter(post => post._id !== postDelete._id)
                }
            })
            toast.success("Post deleted")
        },
            onError: (err) => console.log(err.graphQLError[0].message)
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        postCreate({ variables: { input: values } });
        setValues(initialState);
        setLoading(false);
        toast.success("Post created");
    };

    const handleDelete = (id) => {
        return event => {
            event.preventDefault();
            setLoading(true);
            postDelete({variables: { id: id }})
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const createForm = () => (
        <form onSubmit={handleSubmit}> 
            <div className="form-group">
                <textarea
                    value={content}
                    onChange={handleChange}
                    name="content"
                    rows="5"
                    className="md-textarea form-control"
                    placeholder="Post something cool"
                    maxLength="150"
                    disabled={loading}
                ></textarea>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading || !content.length}>
                Post
            </button>
        </form>
    );

    const modalPostDelete = () => (
        <div 
            className="modal fade"
            id="modalPostDelete"
            tabIndex="-1"
            aria-labelledby="modalPostDeleteLabel"
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalPostDeleteLabel">Delete Post</h5>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete this post?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secundary" data-dismiss="modal">
                            Close
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete(post)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const toggleModal = (id) => {
        return event => {
            event.preventDefault();
            const modalButton = document.getElementById("toggleModalButton");
            modalButton.click();
            setPost(id)
        }
    };

    return (
        <div className="container p-5">
            { loading ? (
                <h4 className="text-danger">Loading...</h4>
            ) : (
                <h4>Create</h4>
            )}

            <button
                id="toggleModalButton"
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#modalPostDelete"
                hidden={true}
            >
            </button>

            { modalPostDelete() }

            <FileUpload
                values={values}
                loading={loading}
                setValues={setValues}
                setLoading={setLoading}
                singleUpload={true}
            />

            <div className="row">
                <div className="col">{createForm()}</div>
            </div>
            <hr />
            <div className="row p-5">
                { posts &&
                    posts.postsByUser.map((post) => (
                        <div className="col-md-6 pt-5" key={post._id}>
                            <PostCard post={post} />
                            <div className="row">
                                <div className="col-md-6">
                                    <Link to={`/post/${post._id}`}>
                                        <p className="text-primary text-center">Edit</p>
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <a onClick={toggleModal(post._id)}>
                                        <p className="text-danger text-center">Delete</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Post;
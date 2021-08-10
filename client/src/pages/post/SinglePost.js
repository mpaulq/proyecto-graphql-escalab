import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { POST_BY_ID } from '../../graphql/queries';
import { POST_DELETE, POST_UPDATE } from '../../graphql/mutations';
import PostCard from '../../components/PostCard';
import FileUpload from '../../components/FileUpload';

const Posts = () => {
    const [values, setValues] = useState({
        id: "",
        content: "",
        image: {
            url: "",
            public_id: ""
        }
    });
    const [loading, setLoading] = useState(false);
    
    let params = useParams();
    let history = useHistory();
    const { data } = useQuery(POST_BY_ID, {
        variables: { id: params.id }
    });

    useMemo(() => {
        if (data) {
            console.log(data.postById);
            setValues({
                ...values,
                id: data.postById._id,
                content: data.postById.content,
                image: {
                    url: data.postById.image.url,
                    public_id: data.postById.image.public_id
                }
            });
        }
    }, [data]);

    // destruct
    const { content } = values;

    // mutation
    const [postUpdate] = useMutation(POST_UPDATE, {
        update: ({ values }) => {
            toast.success("Post updated");
        }
    });
    const [postDelete] = useMutation(POST_DELETE, {
        update: ({ values }) => {
            toast.success("Post deleted");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        postUpdate({ variables: { input: values }});
        setLoading(false);
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setLoading(true);
        postDelete({ variables: { id: params.id } });
        setLoading(false);
        history.push('/profile');
    }

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
                Edit
            </button>
            <button className="btn btn-danger float-right" onClick={handleDelete} disabled={loading || !content.length}>
                Delete
            </button>
        </form>
    );

    return (
        <div className="container">
            { loading ? (
                <h4 className="text-danger">Loading...</h4>
            ) : (
                <h4>Edit Post</h4>
            )}

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
        </div>
    )
}

export default Posts;

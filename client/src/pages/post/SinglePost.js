import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { POST_BY_ID } from '../../graphql/queries';
import { POST_UPDATE } from '../../graphql/mutations';
import FileUpload from '../../components/FileUpload';

const Posts = () => {
    const [values, setValues] = useState({
        id: "",
        content: "",
        image: {
            url: "",
            public_id: ""
        },
        postedBy: {
            username: ""
        }
    });
    const [loading, setLoading] = useState(false);
    
    let params = useParams();
    const { data } = useQuery(POST_BY_ID, {
        variables: { id: params.id }
    });

    useMemo(() => {
        if (data) {
            setValues({
                ...values,
                id: data.postById._id,
                content: data.postById.content,
                image: {
                    url: data.postById.image.url,
                    public_id: data.postById.image.public_id
                },
                postedBy: {
                    username: data.postById.username
                }
            });
        }
    }, [data]);

    // destruct
    const { content } = values;

    // mutation
    const [postUpdate] = useMutation(POST_UPDATE, {
        update: ({ data }) => {
            toast.success("Post updated");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        postUpdate({ variables: { input: {
            id: values.id,
            content: values.content,
            image: values.image
        } }});
        setLoading(false);
    };

    const handleChange = (e) => {
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
                Edit
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

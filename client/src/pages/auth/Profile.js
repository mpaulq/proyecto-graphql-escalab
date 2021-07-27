import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';
// pending imports
import omitDeep from 'omit-deep';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { PROFILE } from  '../../graphql/queries';
import { USER_UPDATE } from  '../../graphql/mutations';
import UserProfile from '../../components/forms/UserProfile';
import FileUpload from '../../components/FileUpload';

const Profile = () => {
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        images: [],
    });
    const [loading, setLoading] = useState(false);

    const { data } = useQuery(PROFILE);
    
    useMemo(() => {
        if (data) {
            console.log(data.profile);
            setValues({
                ...values,
                username: data.profile.username,
                name: data.profile.name,
                email: data.profile.email,
                about: data.profile.about,
                images: omitDeep(data.profile.images, ['__typename']),
            });
        }
    }, [data]);

    // mutation
    const [userUpdate] = useMutation(USER_UPDATE, {
        update: ({ data }) => {
            console.log("USER UPDATE MUTATION IN PROFILE", data);
            toast.success("Profile updated");
        }
    });

    // destructure
    const { username, name, email, about, images } = values;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        userUpdate({ variables: { input: values }});
        setLoading(false);
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    };

    const fileResizeAndUpload = (event) => {

    };

    const profileUpdateForm = () => (
        <div></div>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-12 pb-3">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Profile</h4>
                    )}
                </div>

                <FileUpload setValues={setValues} setLoading={setLoading} values={values} loading={loading} />
            </div>
            <UserProfile {...values} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

export default Profile;

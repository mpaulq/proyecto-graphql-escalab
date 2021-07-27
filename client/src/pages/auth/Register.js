import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import AuthForm from '../../components/forms/AuthForm';

const Register = () => {
    const [email, setEmail] = useState('mpaul@mzzo.com');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = {
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
            handleCodeInApp: true,
        };
        const result = await auth.sendSignInLinkToEmail(email, config);
        console.log('result', result);
        // show toast notification to user about sent email
        toast.success(`Email is sent to ${email}, click the link to complete your registration.`);
        // save user email to localStorage
        window.localStorage.setItem('registrationEmail', email);
        // clear state
        setEmail('');
        setLoading(false);
    };

    return (
        <div className="container p-5">
            {loading ? (
                    <h4 className="text-danger">Loading...</h4>
                ) : (
                    <h4>Register</h4>
                )
            }
            <AuthForm 
                email={email}
                setEmail={setEmail}
                loading={loading}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}

export default Register;

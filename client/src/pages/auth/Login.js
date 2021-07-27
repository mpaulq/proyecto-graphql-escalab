import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
import AuthForm from '../../components/forms/AuthForm';

const Login = () => {
    const { dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState('mpaul@mzzo.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);

    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password).then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token },
                });

                history.push('/');
            });
        } catch (err) {
            console.log('Login error', err);
            toast.error(err.message);
            setLoading(false);
        }
    };

    const googleLogin = () => {
        auth.signInWithPopup(googleAuthProvider).then(async (result) => {
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            dispatch({
                type: 'LOGGED_IN_USER',
                payload: { email: user.email, token: idTokenResult.token },
            });

            history.push('/profile');
        });
    };

    return (
        <div className="container p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Login</h4>}
            <button onClick={googleLogin} className="btn btn-raised btn-danger mt-5">
                Login with Google
            </button>
            <AuthForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                handleSubmit={handleSubmit}
                showPasswordInput="true"
            />
            <Link className="text-danger float-right" to="/password/forgot">
                Forgot Password?
            </Link>
        </div>
    );
}

export default Login;

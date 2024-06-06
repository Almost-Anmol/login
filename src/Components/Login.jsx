import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.username === 'admin' && user.password === 'admin') {
            // alert('Logged in as admin!');
            toast('Logged in as admin!');
            setLoggedIn(true);
            navigate("/Users")

        } else {
            alert('Invalid username or password!');
        }
    }

    return (
        <div className="login-section">
            <div className="login-container">
                <div className="heading">
                    <h1 className='main-heading'>Login Form</h1>
                </div>
                {loggedIn ? (
                    <div className='link'>
                        <p>You are logged in! Redirecting...</p>
                        <Link to="/Users">Go to Users Page</Link>
                    </div>

                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-box">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                id="username"
                                required
                                value={user.username}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                id="password"
                                required
                                value={user.password}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="link">
                            <p>Don't have an account? <Link to='/Register'>Register here</Link></p>
                        </div>
                        <button type='submit' className='submit-button'>Login </button>
                        <ToastContainer/>
                    </form>
                )}
            </div>
        </div>
    )
}

import React, { useState } from 'react'
import './style.css'

const RegisterNew = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        dob: "",
        phone: "",
        password: "",
    });

    const handleFileChange = () => {

    }
    const handleInput = (e) => {
        let { name, value } = e.target
        setUser({
            ...user,
            [name]: value,
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form is submitted!');
        console.log(user);
    }
    return (
        <div>
            RegisterNew
            <div className='outer-box'>
                <div className="left-section">
                    <div className="drag-over">
                        {/* <img src='' alt='' className='' /> */}
                        <img src="/images/register-user.png" alt=""
                                width={200}
                                height={200} />
                        <input type='file' id='fileInput' accept='image/*' onChange={handleFileChange} />
                    </div>

                </div>
                <div className="right-section">
                    <form onSubmit={handleSubmit}>
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
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                id="email"
                                required
                                value={user.email}
                                onChange={handleInput}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterNew
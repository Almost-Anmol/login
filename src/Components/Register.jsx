import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';


export default function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        dob: "",
        phone: "",
        password: "",
        imageSrc: "",
        postalCode: "",
        state: "",
        city: "",

    });
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [dragOver, setDragOver] = useState(false);
    const [isUnValid, setIsUnValid] = useState(true);
    const [isPwValid, setIsPwValid] = useState(true);
    const [isZipValid, setIsZipValid] = useState(true);



    const handleInput = (e) => {
        let { name, value } = e.target
        if (name === 'username') {
            setUser({ username: value });
            setIsUnValid(validateUsername(value));
        } else if (name === 'phone') {
            setUser({ phone: value });
            setIsPhoneValid(validatePhone(value));
        } else if (name === 'password') {
            setUser({ password: value });
            setIsPwValid(validatePassword(value));
        }
        else if (name === 'postalCode') {
            handleZipChange(value)
            // setUser({ postalCode: value });
            // setIsZipValid(validateZip(value));

        }
        setUser({
            ...user,
            [name]: value,
        })

        console.log(e.target.value);

    }


    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUser({
                    imageSrc: reader.result
                })
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUser({
                    ...user,
                    imageSrc: reader.result
                })
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Send form data to JSON Server
        if (isPhoneValid && isPwValid && isUnValid && isZipValid) {
            if (!user.imageSrc) {
                alert('Upload image!');
            } else {

                fetch('http://localhost:3000/formData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Form data saved:', data);
                        setUser({
                            username: "",
                            email: "",
                            dob: "",
                            phone: "",
                            password: "",
                            imageSrc: "",
                            postalCode: "",
                            state: "",
                            city: "",

                        });
                        alert('Form is submitted!');
                    })
                    .catch((error) => {
                        console.error('Error saving form data:', error);
                    });

                console.log('Form submitted successfully');

            }


        }
        else {
            console.log("Erroooorr")
            alert('Enter valid details!');

        }
        console.log(user, "here");

    }



    // Form Validation

    // Username

    const validateUsername = (username) => {
        const regex = /^[a-z]+$/;
        return regex.test(username);
    };

    // Contact


    const validatePhone = (phone) => {
        const regex = /^[6-9]\d{9}$/;
        return regex.test(phone);
    };

    // Password

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    // Zip Code 
    const validateZip = (postalCode) => {
        const regex = /^[1-9]\d{5}$/;
        return regex.test(postalCode);
    };

    // const handleZipChange = (value) => {
    //     console.log(value,"value")
    //     const zipCodeData = {
    //         "122002": { city: "Gurugram", state: "Haryana" },
    //         "250002": { city: "Meerut", state: "Uttar Pradesh" },
    //         "250001": { city: "Meerut", state: "Uttar Pradesh" },
    //         "560001": { city: "Bangalore", state: "Karnataka" },
    //         "400001": { city: "Mumbai", state: "Maharastra" },
    //         "411014": { city: "Pune", state: "Maharastra" },
    //         "500001": { city: "Hyderabad", state: "Telangana" },
    //         // Add more zip codes and corresponding city/state here
    //     };

    //     const zipValue = value.trim();
    //     setIsZipValid(validateZip(zipValue));

    //     if (zipCodeData.hasOwnProperty(zipValue)) {
    //         setUser(prevUser => ({
    //             ...prevUser,
    //             city: zipCodeData[zipValue].city,
    //             state: zipCodeData[zipValue].state
    //         }));

    //     } else {
    //         setUser(prevUser => ({
    //             ...prevUser,
    //             city: '',
    //             state: ''
    //         }));
    //     }
    // };





    const handleZipChange = (value) => {
        // const { value, name } = e.target;
        // console.log(value);
        const zipCodeData = {
            "122002": { city: "Gurugram", state: "Haryana" },
            "250002": { city: "Meerut", state: "Uttar Pradesh" },
            "250001": { city: "Meerut", state: "Uttar Pradesh" },
            "560001": { city: "Bangalore", state: "Karnataka" },
            "400001": { city: "Mumbai", state: "Maharastra" },
            "411014": { city: "Pune", state: "Maharastra" },
            "500001": { city: "Hyderabad", state: "Telangana" },
            // Add more zip codes and corresponding city/state here
        };

        const zipValue = value.trim();
        setIsZipValid(validateZip(zipValue));

        if (zipCodeData.hasOwnProperty(zipValue)) {
            setUser(prevUser => ({
                ...prevUser,
                city: zipCodeData[zipValue].city,
                state: zipCodeData[zipValue].state
            }));
            // document.getElementById('city').value = zipCodeData[value].city;
            // document.getElementById('state').value = zipCodeData[value].state;
        } else {
            setUser(prevUser => ({
                ...prevUser,
                city: '',
                state: ''
            }));
        }
    }


    //     // setIsZipValid(validateZip(value));
    //     // setUser({ postalCode: value });
    //     // if (zipCodeData.hasOwnProperty(value)) {
    //     //     setUser({
    //     //         ...user,
    //     //         city: zipCodeData[value].city,
    //     //         state: zipCodeData[value].state
    //     //     })
    //     //     document.getElementById('city').value = zipCodeData[value].city;
    //     //     document.getElementById('state').value = zipCodeData[value].state;
    //     //     // console.log(user);
    //     //     // setIsDisabled(false)
    //     // }
    //     // else {
    //     //     setIsZipValid(false)
    //     //     setUser({
    //     //         // ...user,
    //     //         city: '',
    //     //         state: ''
    //     //     })
    //     // }
    // }
    function handleNew(val) {
        console.log(val, "newVal")
    }
    console.log(user, "user")
    const pwd = [
        "one uppercase letter",
        "one lowercase letter",
        "one number",
        "one special character",
        "at least 8 characters long"
    ];
    return (
        <div className="section">
            <div className="register-container">

                <div className="heading">
                    <h1 className='main-heading'>Registration Form</h1>
                </div>

                <div className="outer-box">

                    <div className="first-section"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >

                        {user.imageSrc ? (
                            <img src={user.imageSrc} alt="Uploaded Profile" className="profile-image" width={220} height={250} />
                        ) : (
                            <img src='/images/register-user.png' alt="Drag & Drop files here or click to browse"
                                width={250}
                                height={250} />
                        )}


                        <input type='file' id='fileInput' accept='image/' required onChange={handleFileChange} />


                    </div>

                    <form onSubmit={handleSubmit} className="registration-form">
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
                            {!isUnValid && (
                                <p className="alert-box" style={{
                                    color: 'red', background: '#fff',
                                }}>
                                    Username should contain only alphabets and no uppercase letters.
                                </p>
                            )}
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
                        <div className="input-box">

                            <input
                                type="date"
                                name="dob"
                                // placeholder="DOB"
                                id="dob"
                                required
                                value={user.dob}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="number"
                                name="phone"
                                placeholder="Contact"
                                id="phone"
                                required
                                value={user.phone}
                                onChange={handleInput}
                            />
                            {!isPhoneValid && (
                                <p className="alert-box" style={{
                                    color: 'red', background: '#fff',
                                }}>
                                    Enter correct Phone numbber.
                                </p>
                            )}
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
                            {!isPwValid && (
                                <p className="alert-box" style={{
                                    color: 'red', background: '#fff',
                                }}>
                                    Password must contain at least
                                    {pwd.map((item, i) => (
                                        <li>{item}</li>
                                    ))}
                                </p>
                            )}
                        </div>


                        <div className="input-box">

                            {/* <input
                                type="pin"
                                placeholder="Postal Code"
                                name="postalCode"
                                required
                                maxLength="6"
                                id="zip"
                                value={user.postalCode}
                               // onChange={(e) => handleZipChange(e.target.value)}
                                onChange={(e)=>handleNew(e.target.value)}
                            /> */}

                            {/* <input
                            type='number'
                            placeholder='Postal Code'
                            value={user.postalCode}
                            onChange={((e)=> handleNew(e.target.value))}
                            /> */}


                            <input type="pin"
                                placeholder="Postal Code"
                                name="postalCode"
                                required
                                maxLength="6"
                                id="zip"
                                value={user.postalCode}
                                onChange={handleInput}
                            />
                            {!isZipValid && (
                                <p className="alert-box" style={{
                                    color: 'red', background: '#fff',
                                }}>
                                    Enter valid Zip code
                                </p>
                            )}
                        </div>

                        <div className="input-box">
                            <input type="text"
                                placeholder="State"
                                name="state"
                                required
                                value={user.state}
                                id="state"
                                disabled />

                        </div>
                        <div className="input-box">
                            <input type="text"
                                placeholder="City"
                                name="city"
                                required
                                id="city"
                                value={user.city}
                                disabled />
                        </div>
                        <div className="link">
                            <p>Already have an account? <Link to='/'>Login here</Link></p>
                        </div>


                        <button type='submit' className='submit-button'>Register Now</button>

                    </form>

                </div>


            </div>
        </div>

    )
}

// In this code state and city name should be auto populated when the pin code is entered. I am facing 2 problems in this code.
// 1. state and city are not auto populating.
// 2. if they are auto populating, it's not sending data to db.json file

// please give me necessary changes to be done in code to function it properly
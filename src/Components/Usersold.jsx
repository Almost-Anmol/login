import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // Import axios
import data from '../db.json';
import './Users.css';
import { Link } from 'react-router-dom';

function Users() {
    const [users, setUsers] = useState(data?.formData);
    const [selectedRow, setSelectedRow] = useState(null);
    const [deletedItemId, setDeletedItemId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const [editedRow, setEditedRow] = useState(selectedRow);

    const handleInputChange = (key, value) => {
        setEditedRow(prevState => ({
            ...prevState,
            [key]: value
        }));
    };


    useEffect(() => {
        fetch('http://localhost:3001/formData')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const [filterText, setFilterText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleRowClick = (user) => {
        setSelectedRow(user);
        setEditedRow(user);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/formData/${id}`);
            setDeletedItemId(id);
            setUsers(users.filter(item => item.id !== id)); // Remove the deleted item from the local state
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user?.username?.toLowerCase().includes(filterText.toLowerCase()) ||
        user?.email?.toLowerCase().includes(filterText.toLowerCase())
    );


    useEffect(() => {
        const sortedUsersCopy = [...filteredUsers];

        if (sortConfig.key) {
            sortedUsersCopy.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setSortedUsers(sortedUsersCopy);
    }, [sortConfig, filteredUsers]);


    // const sortedUsers = [...filteredUsers];
    // if (sortConfig.key) {
    //     sortedUsers((a, b) => {
    //         if (a[sortConfig.key] < b[sortConfig.key]) {
    //             return sortConfig.direction === 'asc' ? -1 : 1;
    //         }
    //         if (a[sortConfig.key] > b[sortConfig.key]) {
    //             return sortConfig.direction === 'asc' ? 1 : -1;
    //         }
    //         return 0;
    //     });
    // }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3001/formData/${selectedRow.id}`, editedRow);
            setUsers(users.map(user => (user.id === selectedRow.id ? editedRow : user)));
            setShowPopup(false);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };


    return (
        <div className='users-table'>
            <h1>User List</h1>
            <div className='user-filters'>
                <Link to={'/'}>
                    <button className='logout' type='button' >Logout</button>
                </Link>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={filterText}
                    onChange={handleFilterChange}
                />
            </div>
            <table className='users'>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Image</th>
                        <th onClick={() => handleSort('username')}>Username (A-Z)</th>
                        <th >DOB</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th>Phone</th>
                        <th>Delete</th> {/* Added delete column */}
                    </tr>
                </thead>
                <tbody>
                const sortedUsersRows = useMemo(() => {
    return sortedUsers.map((user, index) => (

                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td><img src={user.imageSrc} alt="user" width={50} height={50} /></td>
                        <td>{user.username}</td>
                        <td>{user.dob}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                            <button onClick={() => handleRowClick(user)}>Edit</button>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                    </tr>
                    ));
}, [sortedUsers]);

                    {/* <tr key={index}>
                        <td >{index + 1}</td>
                        <td><img src={user.imageSrc} alt="user" width={50} height={50} /></td>
                        <td>{user.username}</td>
                        <td>{user.dob}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                            <button onClick={() => handleRowClick(user)}>Edit</button>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                    </tr>
                    ))}, [sortedUsers]); */}

                </tbody>
            </table>

            {showPopup && selectedRow && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={() => setShowPopup(false)}> x </span>
                        <h2>User Details</h2>
                        <div className="user-details">
                            <div className="image">
                                <img src={selectedRow.imageSrc} alt="user" width={250} height={250} />
                            </div>
                            <div className="details">
                                {Object.entries(editedRow).map(([key, value]) => {
                                    if (key !== 'imageSrc' && key !== 'password') {
                                        return (
                                            <div key={key}>
                                                <label htmlFor={key}>{key}</label>
                                                {key === 'id' ? (
                                                    <p>{value}</p>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        id={key}
                                                        value={value}
                                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                            </div>
                            <button className='update-button' onClick={handleUpdate}>Update</button>
                            <button className="update-close-button" onClick={() => setShowPopup(false)}>Cancel</button>


                        </div>
                    </div>
                </div>
            )}


            {deletedItemId && <p>Item with ID {deletedItemId} has been deleted.</p>}
        </div>
    );
}

export default Users;

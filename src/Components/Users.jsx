import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import data from '../db.json';
import './Users.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Users() {
    const [users, setUsers] = useState(data?.formData);
    const [selectedAndEditedRow, setSelectedAndEditedRow] = useState(null);
    const [deletedItemId, setDeletedItemId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    // const [editedRow, setEditedRow] = useState(selectedRow);
    const [stateFilter, setStateFilter] = useState('');
    const [filterText, setFilterText] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });



    const sortedUsers = useMemo(() => {
        const filteredUsers = users.filter(user =>
            user?.username?.toLowerCase().includes(filterText.toLowerCase()) ||
            user?.email?.toLowerCase().includes(filterText.toLowerCase())
        );

        const stateFilterResult = users.filter(user =>
            user?.state?.toLowerCase().includes(stateFilter.toLowerCase()) ||
            user?.city?.toLowerCase().includes(stateFilter.toLowerCase())

        );

        let mergedResults = [...filteredUsers, ...stateFilterResult];

        if (sortConfig.key) {
            // return [...mergedResults].sort((a, b) => {
                mergedResults = [...mergedResults].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        // let sortedStateFilterResult = stateFilterResult;
        // if (sortConfig.key) {
        //     sortedStateFilterResult = [...stateFilterResult].sort((a, b) => {
        //         if (a[sortConfig.key] < b[sortConfig.key]) {
        //             return sortConfig.direction === 'asc' ? -1 : 1;
        //         }
        //         if (a[sortConfig.key] > b[sortConfig.key]) {
        //             return sortConfig.direction === 'asc' ? 1 : -1;
        //         }
        //         return 0;
        //     });
        // }
        // return [...filteredUsers, ...sortedStateFilterResult];
        return [...new Set(mergedResults)];

        // return { filteredUsers, stateFilterResult };
    }, [users, filterText, stateFilter, sortConfig]);



    useEffect(() => {
        fetch('http://localhost:3000/formData')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, [users, filterText, stateFilter, sortConfig]);

    const handleInputChange = (key, value) => {
        setSelectedAndEditedRow(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

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
        setSelectedAndEditedRow(user);
        // setEditedRow(user);
        setShowPopup(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/formData/${id}`);
            setDeletedItemId(id);
            setUsers(users.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    const selectionRange = {
        startDate: '21-5-25',
        endDate: '31-5-25',
        key: 'selection',
      }


    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3000/formData/${selectedAndEditedRow.id}`, selectedAndEditedRow);
            setUsers(users.map(user => (user.id === selectedAndEditedRow.id ? selectedAndEditedRow : user)));
            setShowPopup(false);
            toast.success("Success Notification !", {
               // position: toast.POSITION.TOP_RIGHT,
              });
              
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    
    const sortedUsersRows = useMemo(() => sortedUsers.map((user, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td><img src={user.imageSrc} alt="user" width={40} height={40} /></td>
            <td>{user.username}</td>
            <td>{user.dob}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>
                <div className="actions-icon">
                    <FontAwesomeIcon className='icons' icon={faPencil} onClick={() => handleRowClick(user)} />
                    <FontAwesomeIcon className='icons' icon={faTrash} onClick={() => handleDelete(user.id)} />
                </div>

            </td>
        </tr>
    )), [sortedUsers, handleRowClick, handleDelete]);

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
                /> <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
                {/* <input
                    type="text"
                    placeholder="Filter by state/city"
                    value={stateFilter}
                    onChange={handleStateFilterChange}
                /> */}
                {/* <DateRangePicker
                 //ranges={[selectionRange]}
                 //onChange={this.handleSelect}
                 defaultValue={[moment('2022-04-17'), moment('2022-04-21')]}
                  /> */}
                  
            </div>
            <table className='users'>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Image</th>
                        <th onClick={() => handleSort('username')}>Username (A-Z)</th>
                        <th>DOB</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th>Phone</th>
                        <th>Edit/Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsersRows}
                </tbody>
            </table>

            {showPopup && selectedAndEditedRow && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={() => setShowPopup(false)}> x </span>
                        <h2>User Details</h2>
                        <div className="user-details">
                            <div className="image">
                                <img src={selectedAndEditedRow.imageSrc} alt="user" width={250} height={250} />
                            </div>
                            <div className="details">
                                {Object.entries(selectedAndEditedRow).map(([key, value]) => {
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
                            <div className="update-close">
                                <button
                                    className='update-button'
                                    onClick={handleUpdate}>Update</button>
                                     <ToastContainer />
                                <button
                                    className="update-close-button"
                                    onClick={() => setShowPopup(false)}>Cancel</button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deletedItemId && <p>Item with ID {deletedItemId} has been deleted.</p>}
        </div>
    );
}

export default Users;


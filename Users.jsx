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
import { Calendar } from 'react-date-range';
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
    const [startDate, seStartDate] = useState(moment())
    const [endDate, setEndDate] = useState(moment())
    const [state, setState] = useState('')

    // const zipCodeData = {
    //     "122002": { city: "Gurugram", state: "Haryana" },
    //     "250002": { city: "Meerut", state: "Uttar Pradesh" },
    //     "250001": { city: "Meerut", state: "Uttar Pradesh" },
    //     "560001": { city: "Bangalore", state: "Karnataka" },
    //     "400001": { city: "Mumbai", state: "Maharastra" },
    //     "411014": { city: "Pune", state: "Maharastra" },
    //     "500001": { city: "Hyderabad", state: "Telangana" },
    //     // Add more zip codes and corresponding city/state here
    // };
    const stateOptions = ['Haryana','Uttar Pradesh', 'Karanatka', 'Maharastra','Telangana'];
//console.log(stateOptions,state,"stateee")
    const sortedUsers = useMemo(() => {
        const filteredUsers = users.filter(user =>
            user?.username?.toLowerCase().includes(filterText.toLowerCase()) ||
            user?.email?.toLowerCase().includes(filterText.toLowerCase()) ||
            user?.phone?.toLowerCase().includes(filterText.toLowerCase()) ||
            user?.dob?.toLowerCase().includes(filterText.toLowerCase())
        );

        // const stateFilterResult = users.filter(user =>
        //     user?.state?.toLowerCase().includes(stateFilter.toLowerCase()) ||
        //     user?.city?.toLowerCase().includes(stateFilter.toLowerCase())

        // );
        const stateFilterResult = users.filter((user)=>user.state==state)
console.log(stateFilterResult,"statttt")
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
    }, [users, filterText, stateFilter, sortConfig,state]);
    // useEffect(()=>{
    //     users.filter((user)=>user.state == state)
    //     setUsers(users)
    // },[state])

    // useEffect(()=>{
        
    //     if(startDate && endDate){
    //         if(moment(endDate)<moment(startDate)){
    //             toast.error("End Date should be greater then Startdate")
    //         }else{
    //             users.filter()
    //         }
    //     }x
    // },[startDate,endDate])

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

    const handleStartDateChange = (e) =>{
        seStartDate(e.target.value)
    }

    const handleEndDateChange = (e) =>{
        setEndDate(e.target.value)
    }

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
            // await axios.delete(`http://localhost:3000/formData/${id}`);
            // setDeletedItemId(id);
            // setUsers(users.filter(item => item.id !== id));
            const shouldDelete = window.confirm("Are you sure You want to delete?")
            if(shouldDelete){
                await axios.delete(`http://localhost:3000/formData/${id}`);
            setDeletedItemId(id);
            setUsers(users.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

console.log(sortedUsers,"sss")

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3000/formData/${selectedAndEditedRow.id}`, selectedAndEditedRow);
            setUsers(users.map(user => (user.id === selectedAndEditedRow.id ? selectedAndEditedRow : user)));
            setShowPopup(false);
            toast.success("User Updated");
              
        } catch (error) {
            console.error('Error updating data:', error);
            toast.error("OOpssss!!!")
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
                    className='searchbar'
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
                  {/* <Calendar
                  date={moment()} /> */}
                  {/* <DateRangePicker 
                  ranges={[dateRange]}
                //   color={'var(--primary)'}
                //   rangeColors={['var(--primary)']}
                //   direction="horizontal"
                   /> */}
                   {/* <div className='date-picker'>
                    <div>
                        <p style={{fonSize:'10px'}}>StartDate</p>
                        <input type='date' value={startDate} onChange={handleStartDateChange}/>
                    </div>
                    <div>
                        <p>EndDate</p>
                        <input type='date' value={endDate} onChange={handleEndDateChange}/>
                    </div>
                   <input type='date' value={startDate} onChange={handleStartDateChange}/> - <input type='date' value={endDate} onChange={handleEndDateChange}/>
                   </div> */}
                   <div>
                    <span>Select State</span>
                    <select name='state' value={state} onChange={(e)=>setState(e.target.value)}>
                        {
                            stateOptions.map((state)=>{
                                return(
                                    <option value={state} name={state}>{state}</option>
                                )
                                
                            })
                        }
                    </select>
                   </div>
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
                                     <ToastContainer position='top-right' autoClose={5000}/>
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



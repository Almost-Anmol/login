import React, { useState, useEffect } from 'react'
import axios from 'axios';
import data from '../db.json';
import './Users.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UserFile = () => {

  const [users, setUsers] = useState(data?.formData);
  const [userList, setUserList] = useState(data?.formData);
  const [searchText, setSearchText] = useState('')
  const [state, setState] = useState('')
  const [selectedAndEditedRow, setSelectedAndEditedRow] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isUnValid, setIsUnValid] = useState(true);
  const [gender, setGender] = useState('')




  const stateOptions = ['All', 'Haryana', 'Uttar Pradesh', 'Karanatka', 'Maharastra', 'Telangana'];
  const genderOptions = ['All', 'Male', 'Female']

  useEffect(() => {
    fetch('http://localhost:3000/formData')
      .then(response => response.json())
      .then(data => { setUsers(data); setUserList(data) })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    handleSearch()
  }, [searchText])
  useEffect(() => {
    let mergedResults = []
    if (sortConfig.key) {
      // return [...mergedResults].sort((a, b) => {
      mergedResults = users.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setUsers(mergedResults)
  }, [sortConfig])
  useEffect(() => {
    let stateFilter = []
    if (state) {
      if (state === 'All') {
        stateFilter = userList
      } else {
        stateFilter = userList.filter((user) => user.state == state)
      }
    }

    setUsers(stateFilter && stateFilter.length > 0 ? stateFilter : [])
  }, [state])

  useEffect(() => {
    let genderFilter = [];
    let newData = (state || searchText) ? users : userList;
    if (gender) {
      if (gender === 'All') {
        genderFilter = userList
      } else {
        genderFilter = newData.filter((user) => user.gender == gender)
      }
      setUsers(genderFilter)
    }
  }, [gender])
  function handleSearch() {
    const filteredUsers = state ? users : userList.filter(user =>
      user?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user?.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
      user?.dob?.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log(searchText, users, filteredUsers, "uuuu")
    setUsers(filteredUsers)
  }


  // const handleInputChange = (key, value) => {
  //   // let { name, value } = e.target
  //   if (key === 'username') {
  //       setSelectedAndEditedRow({ username: value });
  //       //setIsUnValid(validateUsername(value));
  //   } else if (key === 'phone') {
  //       setSelectedAndEditedRow({ phone: value });
  //       //setIsPhoneValid(validatePhone(value));
  //   } else if (key === 'postalCode') {
  //       setSelectedAndEditedRow(value)
  //       // setUser({ postalCode: value });
  //       // setIsZipValid(validateZip(value));
  //   }
  //   setSelectedAndEditedRow(prevState => ({
  //       ...prevState,
  //       [key]: value
  //   }));
  // };

  function handleInputChange(key, value) {
    console.log(key, value, "kkkkyyy")

    setSelectedAndEditedRow(prevState => ({
      ...prevState,
      [key]: value
    }));
  }
  console.log(selectedAndEditedRow, "kkkkkeddittt")
  const handleDelete = async (id) => {
    try {
      const shouldDelete = window.confirm("Are you sure You want to delete?")
      if (shouldDelete) {
        await axios.delete(`http://localhost:3000/formData/${id}`);
        setDeletedItemId(id);
        setUsers(users.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  function handleSort(key) {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

  }

  const handleUpdate = async () => {
    const user = selectedAndEditedRow;
    try {
      if (user.username != '' && user.phone != '' && user.email != '' && user.dob != '' && validateUsername(user.username) && validatePhone(user.phone)) {
        await axios.put(`http://localhost:3000/formData/${selectedAndEditedRow.id}`, selectedAndEditedRow);
        setUsers(users.map(user => (user.id === selectedAndEditedRow.id ? selectedAndEditedRow : user)));
        // setShowPopup(false);
        toast.success("User Updated");
      } else {
        // alert('Error Occured')
        toast.error("Errorrrr")
      }

    } catch (error) {
      console.error('Error updating data:', error);
      toast.error("OOpssss!!!")
    }
  };

  const validateUsername = (username) => {
    const regex = /^[a-z]+$/;
    return regex.test(username);
  };

  // Contact


  const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  };

  const handleRowClick = (user) => {
    setSelectedAndEditedRow(user);
    // setEditedRow(user);
    setShowPopup(true);
  };
  //const newdata = (searchText || state)? users : userList;

  return (
    <div>
      <div className='users-table'>
        <h1>User List</h1>
        <div className='user-filters'>
          <Link to={'/'}>
            <button className='logout' type='button' >Logoutttt</button>
          </Link>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              //handleSearch()
            }}
            className='searchbar'
          /> <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />

          <div>
            <span>Select State</span>
            <select name='state' value={state} onChange={(e) => setState(e.target.value)}>
              {
                stateOptions.map((state) => {
                  return (
                    <option value={state} name={state}>{state}</option>
                  )

                })
              }
            </select>
          </div>
          <div>
            <span>Select Gender</span>
            <select name='Gender' value={gender} onChange={(e) => setGender(e.target.value)}>
              {
                genderOptions.map((gender) => {
                  return (
                    <option value={gender} name={gender}>{gender}</option>
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
              <th>Email</th>
              <th>Phone</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? users.map((user, index) => (
              <tr key={index} >
                <td>{index + 1}</td>
                <td><img src={user.imageSrc} alt="user" width={50} height={50} /></td>
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
            )) : <div>
              <p>No Data Found</p></div>}
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
                    onClick={handleUpdate}
                  >Update</button>
                  <ToastContainer position='top-right' autoClose={5000} />
                  <button
                    className="update-close-button"
                    onClick={() => setShowPopup(false)}
                  >Cancel</button>

                </div>
              </div>
            </div>
          </div>
        )}

        {deletedItemId && <p>Item with ID {deletedItemId} has been deleted.</p>}
      </div>
    </div>
  )
}

export default UserFile
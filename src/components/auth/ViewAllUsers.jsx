import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../api/user'; // Adjust API path as needed
import { useNavigate } from 'react-router-dom';

import '../../styles/view.scss';
import SearchBox from '../common/SearchBox';
import AddStaff from './AddStaff';

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [addStaffIsOpened, setAddStaffIsOpened] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log(response.data)

      if (response.status === 200) {
        setUsers(response.data);
        setOriginalUsers(response.data)
      } else {
        setError('Failed to fetch users.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await deleteUser(userId);
      console.log(response.data)

      if (response.status === 200 || response.status === 204) {
        alert('User deleted successfully.');
        fetchUsers();
      } else {
        alert('Failed to delete user. Please try again.');
        console.error('Delete failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  const handleAddNewUser = () => {
    setAddStaffIsOpened(true);

    // navigate('/add-user');
  };

  const handleSearchFilter = (details) => {
    if (!details || details.trim() === '') {
      setUsers(originalUsers);
      return;
    }

    const lowerDetails = details.trim().toLowerCase();
    let role = null;

    if (lowerDetails.startsWith('a') || lowerDetails.startsWith('admin')) {
      role = 0;
    } else if (lowerDetails.startsWith('s') || lowerDetails.startsWith('staff')) {
      role = 1;
    }

    const filteredUsers = originalUsers.filter(item =>
      item.fullName.toLowerCase().includes(lowerDetails) ||
      item.email.toLowerCase().includes(lowerDetails) ||
      (role !== null && item.role === role)
    );

    setUsers(filteredUsers);
  };

  const closeModal = () => {
    setAddStaffIsOpened(false);
  }



  return (
    <div className="main-container-box">
      <button className='nav-item' onClick={handleAddNewUser}>+ Add New User</button>

      <div className={`view-container ${addStaffIsOpened ? "blur-sm pointer-events-none select-none" : ""}`}>
        <div className="flex justify-between">
          <h2>View All Users</h2>
          <SearchBox handleSearchFilter={handleSearchFilter} label={'User '} />

        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && users.length === 0 && <p>No users found.</p>}

        {!loading && users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{index + 1}</td>
                  <td>{user.fullName || user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role == 1 ? "Staff" : "Admin" || 'User'}</td>
                  <td>
                    <button onClick={() => handleEdit(user.id)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {addStaffIsOpened && (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]" onClick={closeModal}>
        <div
          className="bg-white p-6 rounded shadow-lg max-w-lg w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <AddStaff closeModal = {closeModal} />
        </div>
      </div>)}
    </div>

  );
};

export default ViewAllUsers;

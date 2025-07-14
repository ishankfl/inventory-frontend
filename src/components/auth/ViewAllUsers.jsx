import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from '../../context/UserContext';
import '../../styles/view.scss';
import SearchBox from '../common/SearchBox';
import AddStaff from './AddStaff';

const ViewAllUsers = () => {
  const {
    users,
    setUsers,
    originalUsers,
    loading,
    error,
    fetchUsers,
    removeUser
  } = useUserContext();

  const [addStaffIsOpened, setAddStaffIsOpened] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    await removeUser(userId);
  };

  const handleAddNewUser = () => {
    setAddStaffIsOpened(true);
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
  };

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
                  <td>{user.role === 1 ? "Staff" : "Admin"}</td>
                  <td>
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

      {addStaffIsOpened && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[101]" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-0"
            onClick={(e) => e.stopPropagation()}
          >
            <AddStaff closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllUsers;

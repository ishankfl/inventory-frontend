import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import '../../styles/view.scss';
import SearchBox from '../common/SearchBox';
import Header from '../common/Header';
import AddStaff from './AddStaff';

const ViewAllUsers = () => {
  const {
    users,
    setUsers,
    originalUsers,
    loading,
    error,
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
    <div className="p-6">
      <div className={`transition-all duration-300 ${addStaffIsOpened ? "blur-sm" : ""}`}>
        <Header
          title="User Management"
          description="Manage and monitor all system users"
          btnTitle="Add User"
          handleButton={handleAddNewUser}
        />
        
        <SearchBox handleSearchFilter={handleSearchFilter} label="User" />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="empty-state">No users found.</p>
        )}

        {!loading && users.length > 0 && (
          <div className="table-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">S.N.</th>
                  <th className="table-header">Full Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{user.fullName || user.name}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">{user.role === 1 ? "Staff" : "Admin"}</td>
                    <td className="table-cell text-center">
                      <button
                        className="action-button button-red"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {addStaffIsOpened && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <AddStaff closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllUsers;
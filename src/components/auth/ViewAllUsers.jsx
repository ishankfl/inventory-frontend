import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import AddStaff from './AddStaff';
import Header from '../common/Header';
import SearchBox from '../common/SearchBox';
import '../../styles/view.scss';

const ViewAllUsers = () => {
  const {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    removeUser,
  } = useUserContext();

  const [addStaffIsOpened, setAddStaffIsOpened] = useState(false);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await removeUser(userId);
      } catch {
        alert('Error deleting user.');
      }
    }
  };

  const handleSearchFilter = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className={`transition-all duration-300 ${addStaffIsOpened ? 'blur-sm' : ''}`}>
        <Header
          title="User Management"
          description="Manage and monitor all system users"
          btnTitle="Add User"
          handleButton={() => setAddStaffIsOpened(true)}
        />

        <SearchBox value={searchQuery} onChange={(e) => handleSearchFilter(e.target.value)} label="User" />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* {!loading && users.length === 0 && <p className="empty-state">No users found.</p>} */}

        <div className="table-container" style={{ minHeight: '200px' }}>
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
                  <td className="table-cell">{index + 1 + (currentPage - 1) * 6}</td>
                  <td className="table-cell">{user.fullName || user.name}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">{user.role === 1 ? 'Staff' : 'Admin'}</td>
                  <td className="table-cell text-center">
                    <button className="action-button button-red" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {addStaffIsOpened && (
        <div className="modal-overlay" onClick={() => setAddStaffIsOpened(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <AddStaff closeModal={() => setAddStaffIsOpened(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllUsers;

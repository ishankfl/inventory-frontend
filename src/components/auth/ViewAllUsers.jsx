import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../api/user'; // Adjust API path as needed
import { useNavigate } from 'react-router-dom';

import '../../styles/view.scss';

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
            console.log(response.data)

      if (response.status === 200) {
        setUsers(response.data);
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
    navigate('/add-user');
  };

  return (
    <div className="main-container-box">
      <button className='nav-item' onClick={handleAddNewUser}>+ Add New User</button>

      <div className="view-container">
        <h2>View All Users</h2>

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
                  <td>{user.role==1?"Staff":"Admin" || 'User'}</td>
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
    </div>
  );
};

export default ViewAllUsers;

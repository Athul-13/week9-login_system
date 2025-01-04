import { useState, useEffect, useMemo, useCallback } from 'react';
import { adminServices } from '../../services/api';
import AdminNav from './AdminNav';
import AddNewUser from './AddNewUser';
import UserEditModal from '../UserEditModal/UserEditModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For edit user modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: ''
  });

  // for modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await adminServices.getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = async (e, optionalQuery = null) => {
    e?.preventDefault();
    const query = optionalQuery || searchQuery;

    if (!query.trim()) {
      fetchUsers();
      return;
    }
    try {
      const data = await adminServices.searchUsers(query);
      setUsers(prevUsers => {
        return data
      });
    } catch (err) {
      setError('Search failed');
      console.error(err);
    }
  };

  const handleDelete = useCallback(async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminServices.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  },[users]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email
    });
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
  };

  const renderedUsers = useMemo(() => {
    return users.map(user => (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          <button
            onClick={()=> {handleEdit(user); setIsEditing(true)}}
            className='btn btn-sm btn-warning me-2'>
            Edit
          </button>
          <button
              onClick={() => handleDelete(user._id)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
        </td>
      </tr>
    ));
  }, [users, handleDelete]);

  return (
    <div>
    {/* Navigation */}
    <AdminNav />
    <div className="admin-dashboard container mt-5">

    {/* Header */}
    <h2 className="text-light text-center mt-4">All Users</h2>

    {/* Search Bar */}
    <div className="search-bar mt-4">
      <form onSubmit={handleSearch} className="d-flex">
        <input
          type="text"
          placeholder="Search users..."
          className="form-control me-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={(e) => handleSearch(e, e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>

    {/* Error Message */}
    {error && <p className="error text-danger mt-3">{error}</p>}

    {/* Users Table */}
    {loading ? (
      <p className="text-center text-light mt-4">Loading...</p>
    ) : (
      <div className="users-table-container table-responsive mt-4">
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderedUsers}
          </tbody>
        </table>
      </div>
    )}

    {/* Edit User Modal */}
    <UserEditModal
      user={selectedUser}
      isOpen={isEditing}
      onClose={()=>{setIsEditing(false); setSelectedUser(null); }}
      onUserUpdated={handleUserUpdated}
    />

    <button className='btn btn-light' onClick={() => setAddModalOpen(true)} >Create New User</button>
  </div>
  {addModalOpen && (
    <AddNewUser 
      isOpen={addModalOpen}
      onClose={()=> setAddModalOpen(false)}
      onUserAdded={handleUserAdded}
      onUserAdd={()=> setAddModalOpen(false)}
    />
  )}
  </div>
  );
};

export default AdminDashboard;
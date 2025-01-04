import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { adminServices } from "../../services/api";
import './UserEditModal.css';

const modalRoot = document.createElement('div');
modalRoot.id = 'modal-root';

const ModalPortal = ({children}) => {
    useEffect(() => {
            document.body.appendChild(modalRoot);

            return () => {
                document.body.removeChild(modalRoot);
            };     
    }, []);
    console.log('modal-root returning');

    return createPortal(children, modalRoot);
};

const UserEditModal = ({ user, isOpen, onClose, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
      });
      const [error, setError] = useState(null);
    
    useEffect(() => {
        // Update formData when the user prop changes
        if (isOpen && user) {
          setFormData({
            name: user.name,
            email: user.email,
          });
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
    
        try {
          if (!formData.name.trim() || !formData.email.trim()) {
            throw new Error('Name and email are required');
          }
    
          const updatedUser = await adminServices.updateUser(user._id, formData);
          onUserUpdated(updatedUser); 
          onClose(); 
        } catch (err) {
          setError(err.message || 'Failed to update user');
          console.error(err);
        }
    };
    
    if (!isOpen) return null; 

    return (
        <ModalPortal>
        <div className="modal-overlay">
            <div className="modal-content">
            <h3 className="text-light">Edit User</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="name" className="text-light">
                    Name:
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control custom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="form-group mt-3">
                <label htmlFor="email" className="text-light">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control custom"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="modal-actions mt-4">
                <button type="submit" className="btn btn-success me-2">
                    Save Changes
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}>
                    Cancel
                </button>
                </div>
            </form>
            </div>
        </div>
        </ModalPortal>
    )
};

export default UserEditModal;
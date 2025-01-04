import { useState } from "react"
import { adminServices } from "../../services/api";
import ReactDom from 'react-dom';
import './AddNewUser.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export default function AddNewUser ({onUserAdd, isOpen, onClose}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error('All fields should be filled');
            }

            const newUser = await adminServices.createUser(formData);
            onUserAdd(newUser);
            setFormData({ name: '', email: '', password: '' });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create user');
            console.error(err);
        }
    }
    return ReactDom.createPortal(
        <div className="modal-overlay">
        <div className="modal-content position-relative">
            <button
                onClick={onClose}
                className="btn-close close-button position-absolute top-0 end-0 mt-2 me-2"
                aria-label="Close"
            ></button>
            <h3 className="text-light mb-4">Add New User</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label text-light">
                        <FontAwesomeIcon icon={faUser} className="icon fa-lg me-2" />
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        className="form-control custom"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label text-light">
                        <FontAwesomeIcon icon={faEnvelope} className="icon fa-lg me-2" />
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        className="form-control custom"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label text-light">
                        <FontAwesomeIcon icon={faLock} className="icon fa-lg me-2" />
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="form-control custom"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">
                    Add User
                </button>
            </form>
        </div>
    </div>,
        document.getElementById('portal-root')
    )
}
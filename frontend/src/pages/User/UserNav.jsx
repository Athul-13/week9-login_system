import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useState } from "react";
import './User.css';
import noProfile from '../../assets/noProfile.webp';
import logo from '../../assets/logo.png';

export default function UserNav () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state)=> state.auth)
    const [previewImage, setPreviewImage] = useState(user?.profilePicture || null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img img-fluid" /> 
          </div>
          <div className="ml-3">
            <p className="logo-text mb-0"><strong>Astericks</strong></p>
          </div>
        </div>

        <ul className="nav-links navbar-nav mx-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/userHome">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
        </ul>
        <div className="user-actions"> 
        <button 
            className="btn btn-secondary dropdown-toggle user-name me-2" 
            type="button" 
            id="userDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
        >
            {user.name} 
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <div className="widget-picture">
            {previewImage ? (
                <img 
                src={previewImage} 
                alt="Profile" 
                className="widget-image"
                />
            ) : (
                <div className="profile-image-placeholder">
                <img 
                src={noProfile} 
                alt="noProfile" 
                className="widget-image"
                />
                </div>
            )}
            </div>
            <li><Link className="dropdown-item" to="/profile">Update</Link></li> {/* Add your edit route */}
        </ul>            
            <button onClick={handleLogout} className='logout-button btn btn-danger'> 
                Logout
            </button>
        </div>
      </div>
    </nav>
  );
};

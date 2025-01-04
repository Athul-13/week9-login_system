import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import './AdminNav.css';
import logo from '../../assets/logo.png';

export default function Navbar () {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

        <ul className="nav-links navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/adminHome">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/adminDashboard">Profiles</Link>
          </li>
        </ul>

        <button onClick={handleLogout} className='logout-button btn btn-danger'> 
          Logout
        </button>
      </div>
    </nav>
  );
};

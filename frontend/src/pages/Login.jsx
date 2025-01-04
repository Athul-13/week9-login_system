import { useState } from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate,useLocation} from "react-router-dom";
import { authService } from "../services/api";
import {setCredentials} from "../redux/authSlice";
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login({email, password});

            dispatch(setCredentials({
                token: data.accessToken,
                refreshToken: data.refreshToken, 
                user: {
                    id: data._id,
                    name: data.name,
                    profilePicture: data.profilePicture,
                    email: data.email,
                    role: data.role
                }
            }));

            const from = data.role === 'admin' ? '/adminHome' : '/userHome';
            console.log("Location State:", location.state);
            console.log("From:", from);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'login failed');
        }
    };

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };


    return (
        <div className="login-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-card card p-4">
          <h2 className="card-title text-center mb-4">LOGIN</h2>
          {error && <p className="error text-danger text-center mb-3">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                <FontAwesomeIcon icon={faUser} className="icon fa-lg me-2" />
              </label>
              <input
                type="email"
                id="email"
                className="form-control custom"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">
                <FontAwesomeIcon icon={faLock} className="icon fa-lg me-2" />
              </label>
                <div className="input-group">
                  <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  className="form-control custom"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  />

                  <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                  </span>
                </div>
            </div>
            <button type="submit" className="btn btn-login w-100" disabled={!email || !password}>LOGIN</button>
          </form>
          <p className="text-center mt-3">Don&apos;t have an account? <Link to="/signup" className="text-primary">Sign Up</Link></p>
        </div>
      </div>
    )
};

export default Login;
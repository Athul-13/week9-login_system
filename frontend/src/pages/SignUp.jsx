import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { setCredentials } from "../redux/authSlice";
import './SignUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCheckCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function SignUp () {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = formData.name.trim();
        const trimmedPassword = formData.password.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmedName || !trimmedPassword) {
            setError('Name and Password cannot be empty or contain only spaces');
            return;
        }

        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password do not match');
            return;
        }
        try {
            const {confirmPassword, ...registerData} = {
                ...formData,
                name: trimmedName,
                password: trimmedPassword
            };
            const data = await authService.register(registerData);
            dispatch(setCredentials({accesToken: data.accessToken}));
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error(err.message);
            navigate('/login');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };

    return (
        <div className="login-container d-flex justify-content-center align-items-center min-vh-100">
            <div className="login-card card p-4">
                <h2 className="card-title text-center mb-4">REGISTER</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="form-label"><FontAwesomeIcon icon={faUser} className="icon fa-lg me-2" /></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control custom"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label"><FontAwesomeIcon icon={faEnvelope} className="icon fa-lg me-2" /></label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control custom"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label"><FontAwesomeIcon icon={faLock} className="icon fa-lg me-2" /></label>
                        <div className="input-group">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-control custom"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </span>
                        </div>    
                    </div>
                    <div className="form-group mb-3">
                    <label htmlFor="confirmPassword" className="form-label"><FontAwesomeIcon icon={faCheckCircle} className="icon fa-lg me-2" /></label>
                        <div className="input-group">
                            <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control custom"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            />

                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-login w-100">Register</button>
                </form>
                <p className="text-center mt-3">Already have an account? <Link to="/" className="text-primary">Login</Link></p>
            </div>
        </div>
    )
}
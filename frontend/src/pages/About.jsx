import { useSelector } from 'react-redux';
import './About.css';
import UserNav from './User/UserNav';
import Navbar from './Admin/AdminNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';


export default function About () {
    const {isAdmin} = useSelector((state)=>state.auth);

    return (
        <>
        {isAdmin ? < Navbar /> : < UserNav />}
        
      <div className="container mt-5">
        <h1 className="text-center text-light mb-5">About Us</h1>
  
        {/* Section 1 */}
        <div className="content-section">
          <div className="content-text">
            <h3>Introduction</h3>
            <p>Welcome to [Your App Name], a platform designed to provide seamless role-based access management. Whether you're an admin, a regular user, or someone managing specific roles, our app ensures smooth and efficient control.</p>
          </div>
        </div>
  
        {/* Section 2 */}
        <div className="content-section">
          <div className="content-text">
            <h3>Mission Statement</h3>
            <p>Our mission is to provide a simple, secure, and adaptable solution for managing role-based access systems, empowering organizations to streamline their user management processes.</p>
          </div>
        </div>
  
        {/* Section 3 */}
        <div className="content-section">
          <div className="content-text">
            <h3>Features</h3>
            <p>- Role-based access control<br />
               - User authentication with signup and login<br />
               - Admin dashboard with full control<br />
               - Secure profile picture upload<br />
               - Easy navigation and intuitive design</p>
          </div>
        </div>
  
        {/* Section 4 */}
        <div className="content-section">
          <div className="content-text">
            <h3>Team Information</h3>
            <p>Hi, I’m Athul Unnikrishnan, the developer of [Your App Name]. With a background in web development and a passion for creating efficient solutions, I built this platform to offer seamless management of user roles and permissions.</p>
          </div>
        </div>
  
        {/* Section 5 */}
        <div className="content-section">
          <div className="content-text">
            <h3>Contact Information</h3>
            <p>Name: Athul Unnikrishnan<br />
                Phone: 9746730509 <br />
                Socials: 
                <ul className="list-inline">
                    <li className="list-inline-item"><a href="#">
                    <FontAwesomeIcon icon={faFacebook} />
                    </a></li>
                    <li className="list-inline-item"><a href='#'>
                    <FontAwesomeIcon icon={faLinkedin} />
                    </a></li>
                    <li className="list-inline-item"><a href="#">
                    <FontAwesomeIcon icon={faInstagram} />
                    </a></li>
                    <li className="list-inline-item"><a href="">
                    <FontAwesomeIcon icon={faYoutube} />
                    </a></li>
                </ul>
            </p>
          </div>
        </div>
      </div>
      </>
    );
  };
  
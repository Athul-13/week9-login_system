import { useSelector } from 'react-redux';
import './User.css';
import UserNav from './UserNav';

export default function UserHome () {
    const { user } = useSelector(state => state.auth);

    return (
        <div>
            < UserNav />
            <div className="admin-container container mt-5">
            
                <div className="welcome-section text-center">
                    <h2>Welcome, {user.name}</h2>
                </div>

                <div className="updates-section mt-4">
                    <h5>Latest Updates</h5>
                    <ul className="updates-list">
                    <li className="update-item">Update 1: Feature X launched</li>
                    <li className="update-item">Update 2: User count reached 1000</li>
                    <li className="update-item">Update 3: Maintenance scheduled for this Friday</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
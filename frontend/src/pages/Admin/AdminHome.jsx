import AdminNav from './AdminNav'
import './AdminHome.css';

export default function AdminHome () {
    return (
        <div>
            < AdminNav />
            <div className="admin-container container mt-5">
            
                <div className="welcome-section text-center">
                    <h2>Welcome, Boss</h2>
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
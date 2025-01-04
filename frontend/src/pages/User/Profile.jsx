import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';
import { authService } from '../../services/api';
import './User.css';
import noProfile from '../../assets/noProfile.webp';
import UserNav from './UserNav';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
        setPreviewImage(user.profilePicture || null);
    }
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewImage && previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
      }
    };
}, [user, previewImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    const file = e.target.profilePicture.files[0];
    if (!file) {
        setError('Please select a file');
        return;
    }
    console.log('submit file:',file);

    setIsLoading(true);
    setError('');

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'profile_pictures');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dncoxucat/image/upload`,
          {
              method: 'POST',
              body: formData,
          }
      );
      const data = await response.json();

      if (data.error) {
          throw new Error(data.error.message);
      }
      const updatedProfile = await authService.UpdatePicture({
        imageUrl: data.secure_url
    });

    dispatch(setCredentials({
      token:updatedProfile.accessToken,
      refreshToken: updatedProfile.refreshToken,
      user: {
        ...user,
        profilePicture: data.secure_url
      },
    }));
    
    setSuccess('Profile picture updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.log('error:',err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    < UserNav />
    <div className="profile-container d-flex justify-content-center align-items-center min-vh-100">
    <div className="login-card card p-4">
      <h2 className='card-title text-center mb-4'>Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="profile-content">
        <div className="profile-picture">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile" 
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              <img 
              src={noProfile} 
              alt="No Profile" 
              className="profile-image"
            />
            </div>
          )}
        </div>
        <div className="user-details">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
        </div>
    </div>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <div className="form-group mb-3">
            <label htmlFor="profilePicture" className="form-label">Profile Picture:</label>
            <input
              type="file"
              id="profilePicture"
              name="file"
              className="form-control custom"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type='submit' className="btn btn-dark btn-save" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Profile;
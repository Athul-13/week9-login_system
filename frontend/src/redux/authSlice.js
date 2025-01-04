  import { createSlice } from "@reduxjs/toolkit";


  const initialState = {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
    };
    
    // Safely load from localStorage AFTER initialState is defined
    const loadFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          initialState.user = {
            ...parsedUser,
            profilePicture: parsedUser.profilePicture || null
          }

          initialState.isAuthenticated = true; 
          initialState.isAdmin = initialState.user.role === 'admin';
        }
    
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          initialState.token = storedToken;
        }
    
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          initialState.refreshToken = storedRefreshToken;
        }
    
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        //  Handle the error gracefully (clear localStorage, show error, etc.) 
      }
    };
    
    // Call the loading function 
    loadFromLocalStorage();
    
  const authSlice = createSlice({
      name: 'auth',
      initialState,
      reducers: {
          setCredentials: (state, action) => {
              const { token, refreshToken, user } = action.payload;
              state.token = token;
              state.refreshToken = refreshToken;
              state.user = {
                  ...user,
                  profilePicture: user.profilePicture || null
              };
              state.isAuthenticated = true;
              state.isAdmin = user && user.role === 'admin';

              localStorage.setItem('token', token);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('user', JSON.stringify(user));

              console.log('Auth state updated:', {
                  isAuthenticated: true,
                  isAdmin: user.role === 'admin',
                  hasToken: !!token
              });
            },
          logout: (state) => {
              state.user = null;
              state.token = null;
              state.refreshToken = null;
              state.isAuthenticated = false;
              state.isAdmin = false;

              console.log('successfully logged out');

              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
          },
      },
  });

  export const { setCredentials, logout} = authSlice.actions;
  export default authSlice.reducer;
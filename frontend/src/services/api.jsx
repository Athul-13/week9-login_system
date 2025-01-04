    import axios from 'axios';

    const API_URL = 'http://localhost:5000/api';

    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers.Authorization;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    export const authService = {
        login: async (credentials) => {
            const response = await api.post('/auth/login', credentials);
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
        },
        register: async (userData) => {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        },
        UpdatePicture: async ({imageUrl}) => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.put('/auth/users/profile', {
                    imageUrl: imageUrl,
                },{
                    headers: {
                      'Authorization': `Bearer ${token}`, // Correct format is important
                    }
            });

                return response.data;
            } catch (err) {
                console.error('Uploadin error:',err);
                throw err;
            }
        }
    };

    export const adminServices = {
        getAllUsers: async () => {
            const response = await api.get('/auth/users');
            return response.data;
        },
        getUserById: async (id) => {
            const response = await api.get(`/auth/users/${id}`);
            return response.data;
        },
        updateUser: async (id, userData) => {
            const response = await api.put(`/auth/users/${id}/edit`, userData);
            return response.data;
        },
        deleteUser: async (id) => {
            const response = await api.delete(`/auth/users/${id}`);
            return response.data;
        },
        searchUsers: async (query) => {
            const response = await api.get(`/auth/users/search?q=${query}`);
            return response.data;
        },
        createUser: async (userData) => {
            const response = await api.post('/auth/signup', userData); 
            return response.data; 
        }
    };

    export default api;
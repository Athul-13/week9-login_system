import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/User/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminHome from "./pages/Admin/AdminHome";
import UserHome from "./pages/User/UserHome";
import About from "./pages/About";

  export default function App () {
    return (
      <BrowserRouter>
        <Routes>

          < Route path="/About" element={< About />} />

          <Route path="/" element={< Login />} />
          <Route path="/login" element={< Login />} />
          <Route path="/signup" element={< SignUp />}/>

          <Route
            path="/profile"
            element={
                <PrivateRoute>
                  < Profile />
                </PrivateRoute>
              }
          />
          <Route
            path="/userHome"
            element={
                <PrivateRoute>
                  < UserHome />
                </PrivateRoute>
              }
          />
          <Route
            path="/adminHome"
            element={
              <AdminRoute>
                < AdminHome />
              </AdminRoute>
            }
          />
          <Route 
            path="/adminDashboard" 
            element={
                <AdminRoute>
                  < AdminDashboard />
                </AdminRoute>
              }
          />

        </Routes>
      </BrowserRouter>
    )
  }
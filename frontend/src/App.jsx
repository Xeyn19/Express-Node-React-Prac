import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Applications from './pages/Applications';
import AddJob from './pages/AddJob';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/applications' element={<Applications />} />
            <Route path='/add-job' element={<AddJob />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

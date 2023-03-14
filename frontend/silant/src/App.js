import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Header from './pages/app/Header';
import Home from './pages/Home';
import Machine from './pages/Machine';
import Maintenance from './pages/app/Maintenance';
import Reclamation from './pages/Reclamation';
import LoginPage from './pages/LoginPage';
import Logout from './pages/Logout';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './pages/app/Footer';

function App() {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (token) {
      const options = {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        },
      };
      fetch('http://127.0.0.1:8000/api/v1/auth/users/me', options).then(res => res.json())
      .then(result => {
        setUser(result)
      }).catch(error => console.log(error.message));
    }
    }, []);
  

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/machine" element={<Machine />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/reclamation" element={<Reclamation />} />
          <Route path="/login" element={<LoginPage user={user}/>} />
          <Route path="/logout" element={<Logout user={user}/>} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>  
    </div>
  );
}

export default App;

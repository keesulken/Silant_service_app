import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Header from './pages/app/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Machine from './pages/Machine';
import LoginPage from './pages/LoginPage';
import Logout from './pages/Logout';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './pages/app/Footer';
import Detail from './pages/Detail';
import Create from './pages/Create';
import UpdateList from './pages/UpdateList';
import Update from './pages/Update';
import UserForm from './pages/crud/UserForm';
import UserList from './pages/crud/UserList';

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
        <div id='body-root'>
          <Routes>
            <Route path="/" element={<Home user={user}/>} />
            <Route path="/admin" element={<Admin user={user}/>} />
            <Route path="/user/create" element={<UserForm user={user}/>} />
            <Route path="/user/update" element={<UserList user={user}/>} />
            <Route path="/user/update/:id" element={<UserForm user={user}/>} />
            <Route path="/machine/:id" element={<Machine user={user}/>} />
            <Route path="/:details/:id" element={<Detail user={user}/>} />
            <Route path="/create/:instance" element={<Create user={user}/>} />
            <Route path="/update/:instance" element={<UpdateList user={user}/>} />
            <Route path="/update/:instance/:id" element={<Update user={user}/>} />
            <Route path="/login" element={<LoginPage user={user}/>} />
            <Route path="/logout" element={<Logout user={user}/>} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>  
    </div>
  );
}

export default App;

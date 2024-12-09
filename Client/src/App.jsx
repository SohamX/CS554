import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ApiProvider } from './contexts/ApiContext';
import Login from './components/Login';
import User from './components/User'
import PageNotFound from './components/PageNotFound';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <ApiProvider>
        <div className='App'>
          <header className='App-header'>
          </header>
          <div className='App-body'>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/user/:id" element={<User />} />
              <Route path='/*' element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
      </ApiProvider>
    </Router>
  );
}

export default App;
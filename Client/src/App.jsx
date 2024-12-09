import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ApiProvider } from './contexts/ApiContext';
import Login from './components/Login';

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
            </Routes>
          </div>
        </div>
      </ApiProvider>
    </Router>
  );
}

export default App;
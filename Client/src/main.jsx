import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import fbconfig from './firebase/FirebaseConfig';
import {initializeApp} from 'firebase/app';

const app = initializeApp(fbconfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

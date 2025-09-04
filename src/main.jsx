import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import login from './pages/login'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
)
 // import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Login from './pages/login'; // use letra maiúscula, componente deve começar com maiúscula
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Login />
//   </React.StrictMode>
// );
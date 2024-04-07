import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css'

import { MessagesContextProvider } from './contexts/MessagesContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MessagesContextProvider>
      <App />
    </MessagesContextProvider>
  </React.StrictMode>
);

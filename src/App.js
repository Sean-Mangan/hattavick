import './App.css';
import React from "react";
import { Typography } from '@mui/material';
import SideNav from './components/SideNav/SideNav';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <SideNav/>
    </Router>
  );
}

export default App;

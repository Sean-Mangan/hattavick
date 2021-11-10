import './App.css';
import React from "react";
import { Typography } from '@mui/material';
import SideNav from './components/SideNav/SideNav';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MyCharacterStats from './pages/MyCharacterStats/MyCharacterStats';

function App() {
  return ( 
    <Router>
      <SideNav/>
      <Routes>
        <Route path='/mycharacter/stats' exact element={<MyCharacterStats/>}/>
      </Routes>
    </Router>
  );
}

export default App;

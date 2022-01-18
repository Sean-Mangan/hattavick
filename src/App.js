import './App.css';
import React, {useState} from "react";
import SideNav from './components/SideNav/SideNav';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MyCharacterStats from './pages/MyCharacterStats/MyCharacterStats';
import NPCs from './pages/NPCs/NPCs';
import LoginPage from './pages/Login/login';
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';

function App() {
  const [loggedIn, setloggedIn] = useState(false)
  const [name, setName] = useState("")

  const Real_pages = 
    <div>
        <Router>
          <SideNav/>
          <Routes>
            <Route path='/mycharacter/stats' exact element={<MyCharacterStats/>}/>
            <Route path='/characters/npcs' exact element={<NPCs/>}/>
          </Routes>
        </Router>
      </div>


  return ( 
    <>
    {(!loggedIn) ? <LoginPage setName={setName} setLogin={setloggedIn}/> : Real_pages}
    </>
  );
}

export default App;

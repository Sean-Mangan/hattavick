import './App.css';
import React from "react";
import SideNav from './components/SideNav/SideNav';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MyCharacterStats from './pages/MyCharacterStats/MyCharacterStats';
import NPCs from './pages/NPCs/NPCs';

function App() {

  return ( 
    <div>
      <Router>
        <SideNav/>
        <Routes>
          <Route path='/mycharacter/stats' exact element={<MyCharacterStats/>}/>
          <Route path='/characters/npcs' exact element={<NPCs/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

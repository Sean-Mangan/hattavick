import './App.css';
import React, {useState, useEffect} from "react";
import axios from 'axios';
import SideNav from './components/SideNav/SideNav';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MyCharacterStats from './pages/MyCharacterStats/MyCharacterStats';
import NPCs from './pages/NPCs/NPCs';
import LoginPage from './pages/Login/login';
import HomePage from './pages/HomePage/HomePage'
import Example from "./pages/Example/Example";
import AdminPage from './pages/AdminPage/AdminPage';

axios.defaults.withCredentials = true;

function App() {
  const [loggedIn, setloggedIn] = useState(false)
  const [name, setName] = useState("")

  //export NODE_OPTIONS=--openssl-legacy-provider

  var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/login'

  useEffect(() => {
    login();
  },[]);

  async function login(){
    try{
      var response = await axios.post(uri, {'name' : name},
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })

      if (response.data.name){
          setName(response.data.name);
          setloggedIn(true);
      }
    }catch (err){
        console.log(err)
    }
  }

  const Real_pages = 
    <div>
        <Router>
          <SideNav userName={name}/>
          <Routes>
            <Route path='/' exact element={<HomePage/>}/>
            <Route path='/mycharacter/stats' exact element={<MyCharacterStats/>}/>
            <Route path='/characters/npcs' exact element={<NPCs/>}/>
            <Route path='/character/:name' exact element={<Example/>}/>
            <Route path='/admin' exact element={<AdminPage/>}/>
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

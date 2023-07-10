import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import LoginPage from './Pages/LoginPage/LoginPage';
import PasswordReset from './Pages/PasswordReset/PasswordReset'
import JoinPage from './Pages/JoinPage/JoinPage';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import React, {useState, useEffect} from 'react'
import CreateCampaignPage from './Pages/CreateCampaignPage/CreateCampaignPage';
import ValidateCampaignUser from './Components/ValidateCampaignUser/ValidateCampaignUser';
import CampaignNavBarWrapper from './Components/CampaignNavBar/CampaignNavBarWrapper';
import HomeNavWrapper from './Components/HomeNav/HomeNavWrapper';
import CampaignHomePage from './Pages/CampaignPages/CampaignHomePage/CampaignHomePage';
import MyCharacterPage from './Pages/CampaignPages/MyCharacterPage/MyCharacterPage';
import PartyPage from './Pages/CampaignPages/PartyPage/PartyPage';
import CharacterPage from './Pages/CampaignPages/CharacterPage/CharacterPage';
import NPCsPage from './Pages/CampaignPages/NPCsPage/NPCsPage';
import SettingsPage from './Pages/CampaignPages/SettingsPage/SettingsPage';
import WorldLorePage from './Pages/CampaignPages/WorldLorePage/WorldLorePage';
import FactionsPage from './Pages/CampaignPages/LorePages/FactionsPage';
import LocationsPage from './Pages/CampaignPages/LorePages/LocationsPage';
import ThingsPage from './Pages/CampaignPages/LorePages/ThingsPage';
import SessionsPage from './Pages/CampaignPages/SessionsPage/SessionsPage';
import Contact from './Pages/ContactPage/contact';
import NPCPage from './Pages/CampaignPages/NPCPage/NPCPage';
import CampaignErrorLoadingWindow from './Components/CampaignErrorLoadingWindow/CampaignErrorLoadinWindow';



function App() {  
  return (
    <>
      <Router>
        <Routes>
          <Route exact element={<HomeNavWrapper/>} >
            <Route path="/login" exact element={<LoginPage/>}/>
            <Route path='/reset/:reset_id' exact element={<PasswordReset/>}/>
            <Route path='/contact' exact element={<Contact />}/>
            <Route path="*" exact element={<HomePage/>}/>
            <Route element={<RequireAuth/>}>
              <Route path="/join/:campaign_id" exact element={<JoinPage/>}/>
              <Route path="/join/:campaign_id/:invite_id" exact element={<JoinPage/>}/>
              <Route path="/create" exact element={<CreateCampaignPage/>}/>
            </Route>
        </Route>

          {/* These routes require login to be rendered */}
          <Route element={<RequireAuth/>}>
            <Route element={<ValidateCampaignUser />}>
              <Route exact element={<CampaignNavBarWrapper/>} >
                <Route element={<CampaignErrorLoadingWindow/>}>
                  <Route path="/campaign/:campaignId" exact element={<CampaignHomePage/>}/>
                  <Route path="/campaign/:campaignId/lore/worldlore" exact element={<WorldLorePage />}/>
                  <Route path="/campaign/:campaignId/settings" exact element={<SettingsPage/>}/>
                  <Route path="/campaign/:campaignId/characters/npcs" exact element={<NPCsPage />}/>
                  <Route path="/campaign/:campaignId/characters/mycharacter" exact element={<MyCharacterPage />}/>
                  <Route path="/campaign/:campaignId/characters/party" exact element={<PartyPage />}/>
                  <Route path="/campaign/:campaignId/characters/pc/:characterId" exact element={<CharacterPage />}/>
                  <Route path="/campaign/:campaignId/characters/npc/:characterId" exact element={<NPCPage />}/>
                  <Route path="/campaign/:campaignId/lore/factions" exact element={<FactionsPage/>}/>
                  <Route path="/campaign/:campaignId/lore/locations" exact element={<LocationsPage />}/>
                  <Route path="/campaign/:campaignId/lore/things" exact element={<ThingsPage/>}/>
                  <Route path="/campaign/:campaignId/notes/sessions" exact element={<SessionsPage />}/>
                </Route>
              </Route>
            </Route>
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import LoginPage from './Pages/LoginPage/LoginPage';
import PasswordReset from './Pages/PasswordReset/PasswordReset'
import PersistLogin from './Components/PersistLogin/PersistLogin';
import JoinPage from './Pages/JoinPage/JoinPage';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import React, {useState, useEffect} from 'react'
import useAxiosPrivate from './hooks/useAxiosPrivate';
import useAuth from './hooks/useAuth';
import CreateCampaignPage from './Pages/CreateCampaignPage/CreateCampaignPage';
import ValidateCampaignUser from './Components/ValidateCampaignUser/ValidateCampaignUser';
import CampaignNavBarWrapper from './Components/CampaignNavBar/CampaignNavBarWrapper';
import HomeNavWrapper from './Components/HomeNav/HomeNavWrapper';
import CampaignHomePage from './Pages/CampaignPages/CampaignHomePage/CampaignHomePage';
import MyCharacterPage from './Pages/CampaignPages/MyCharacterPage/MyCharacterPage';
import PartyPage from './Pages/CampaignPages/PartyPage/PartyPage';
import CharacterPage from './Pages/CampaignPages/CharacterPage/CharacterPage';
import NPCsPage from './Pages/CampaignPages/NPCsPage/NPCsPage';


function App() {

    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate()
    const [campaigns, setCampaigns] = useState({admin:[], owner: [], player: []})
    const [loaded, setLoaded] = useState(true)

    useEffect(() => {
      get_campaigns()
    },[])

    const get_campaigns = () => {
        axiosPrivate.get("/campaign").then((resp) => {
            setCampaigns(resp.data)
            setLoaded(true)
        }).catch((err) => {
            setLoaded(true)
        })
    }
  
  return (
    <>
      {(loaded) 
      ?
        <>
          <Router>
            {/* <HomeNav campaigns={campaigns} loggedIn={auth?.accessToken}/> */}
            <Routes>
              <Route exact element={<HomeNavWrapper campaigns={campaigns} loggedIn={auth?.accessToken}/>} >
                <Route path="/login" exact element={<LoginPage reload={get_campaigns}/>}/>
                <Route path='/reset/:reset_id' exact element={<PasswordReset/>}/>
                <Route path="*" exact element={<HomePage/>}/>
                <Route exact element={<PersistLogin/>}>
                  <Route element={<RequireAuth/>}>
                    <Route path="/join/:campaign_id" exact element={<JoinPage/>}/>
                    <Route path="/create" exact element={<CreateCampaignPage campaign_refresh={get_campaigns}/>}/>
                  </Route>
                </Route>
              </Route>

              {/* All these routes have information specific to users and require auth */}
              {/* <Route exact element={<PersistLogin/>}/> */}

                {/* These routes require login to be rendered */}
              <Route exact element={<PersistLogin/>}>
                <Route element={<RequireAuth/>}>
                  <Route element={<ValidateCampaignUser />}>
                    <Route exact element={<CampaignNavBarWrapper campaigns={campaigns} loggedIn={auth?.accessToken}/>} >
                      <Route path="/campaign/:campaignId" exact element={<CampaignHomePage/>}/>
                      <Route path="/campaign/:campaignId/characters/npcs" exact element={<NPCsPage />}/>
                      <Route path="/campaign/:campaignId/characters/mycharacter" exact element={<MyCharacterPage />}/>
                      <Route path="/campaign/:campaignId/characters/party" exact element={<PartyPage />}/>
                      <Route path="/campaign/:campaignId/characters/:pc/:characterId" exact element={<CharacterPage />}/>
                    </Route>
                  </Route>
                </Route>
              </Route>

            </Routes>
          </Router>
        </>
        :
        <></>
      }
    </>
  );
}

export default App;

import React, {useState, useEffect} from 'react'
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import axios from 'axios';
import AdminSessionPageRow from '../../components/AdminSessionPageRow/AdminSessionPageRow';
import { get_sessions} from '../../utils/queries';
import { uuid } from 'uuidv4';

import './AdminSessionsPage.css';

function AdminSessionsPage() {

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/sessions'

    const [sessions, setSessions] = useState([])

    useEffect(async () => {
        reload()
    }, [])

    async function reload() {
        var sessions_call = await get_sessions()
        if (sessions_call){
            setSessions(sessions_call)
        }else{
            console.log("Can't get session data")
        }
    }

  const handleSubmit = async (event) => {
      console.log(event)
    event.preventDefault();
    try{
      var response = await axios.post(uri, {title : event.target.title.value},
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })
      reload()
    }catch (err){
        console.log(err)
    }
  };

  return (
      <Content_Wrapper>
        <div className='admin_session_wrapper'>
            <div className='admin_session_title'>AdminSessionsPage</div>
            <form name="create_session" onSubmit={handleSubmit}>
                Add Session: 
                <input name="title" placeholder="Session Title" type="text"/>
                <button type='submit'> Submit </button>
            </form>
        </div>
        <div className='admin_session_row_wrapper'> 
        {sessions && sessions.length > 0 ?  (
            sessions.map((session) => (<AdminSessionPageRow key={uuid()} reload={reload} session={session}/>))) 
            : (<h3>No Sessions</h3>)
        }
        </div>
      </Content_Wrapper>
    
  )
}

export default AdminSessionsPage
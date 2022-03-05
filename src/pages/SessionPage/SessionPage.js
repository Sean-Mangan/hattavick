import React, {useState, useEffect} from 'react'
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper'
import { get_session_data, get_sessions } from '../../utils/queries'
import SessionRow from '../../components/SessionRow/SessionRow'
import { uuid } from 'uuidv4';
import './SessionPage.css'

function SessionPage() {

    const [overview, setOverview] = useState(false)
    const [sessions, setSessions] = useState([])

    useEffect(async () => {
        var data = await get_session_data()
        if (data){
            setOverview(data.data)
        }else{
            console.log("Can't get session overview data")
        }
        var sessions_call = await get_sessions()
        if (sessions_call){
            setSessions(sessions_call)
        }else{
            console.log("Can't get session data")
        }
    }, [])


  return (
    <Content_Wrapper>
        <div className='session_wrapper'>
            <h3 className='session_title'>Sessions</h3>
        </div>
        <p className='party_overview'>
            {overview}
        </p>
        <div className='session_row_wrapper'>
            {sessions && sessions.length > 0 ?  (
                sessions.map((session) => (<SessionRow key={uuid()} session={session}/>))) 
                : (<h3 style={{textAlign: 'Center'}}>No Sessions</h3>)
            }
        </div>
    </Content_Wrapper>
  )
}

export default SessionPage
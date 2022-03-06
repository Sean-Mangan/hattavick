import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import axios from 'axios';
import "./WorldLore.css"
import { get_worldlore_data } from '../../utils/queries';
import { Typography, Paper } from '@mui/material';
import { uuid } from 'uuidv4';


function WorldLorePage() {

    const [overview, setOverview] = useState(false)

    useEffect(async () => {
        var data = await get_worldlore_data()
        if (data){
            setOverview(data.data)
        }else{
            console.log("Can't get homepage data")
        }
    }, [])

  return (
        <Content_Wrapper>
            <div style={{alignItems:"center", textAlign:'center'}}>
                <h3 className='lore_title'>World Lore</h3>
            </div>
            <div className='img_wrapper'>
                <img className='world_map' src="https://i.imgur.com/usELjfM.png"/>
            </div>
            {(overview) 
                    ?  overview.map((p) => {
                        if (p === overview[overview.length -1]){
                            return <div key={uuid()}><br/><p className='homepage_overview bottom'>&emsp;{p}</p><br/><br/></div>
                        }else{
                        return <div key={uuid()}><p className='homepage_overview'>&emsp;{p}</p><br/></div> 
                        }
                    })
                    : <></>}
      </Content_Wrapper>
  )
}

export default WorldLorePage
import React, {useState, useEffect} from 'react';
import { Typography } from '@mui/material';
import {get_homepage_data} from '../../utils/queries'


import './HomePage.css';

function HomePage() {
    const [overview, setOverview] = useState(false)

    useEffect(async () => {
        var data = await get_homepage_data()
        if (data){
            setOverview(data.data)
        }else{
            console.log("Can't get homepage data")
        }
    }, [])

    return (
        <div className='homepage_wrapper'>
            <h3 className='homepage_title'>Welcome to Hattavick</h3>
            {(overview) 
                ?  overview.map((p) => {
                    if (p === overview[overview.length -1]){
                        return <><br/><p className='homepage_overview bottom'>&emsp;{p}</p><br/><br/></>
                    }else{
                      return <><p className='homepage_overview'>&emsp;{p}</p><br/></> 
                    }
                })
                : <></>}
        </div>
    )
}

export default HomePage

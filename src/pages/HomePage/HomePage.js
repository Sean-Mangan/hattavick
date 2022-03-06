import React, {useState, useEffect} from 'react';
import {get_homepage_data} from '../../utils/queries'
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import { uuid } from 'uuidv4';


import './HomePage.css';

function HomePage() {
    const [overview, setOverview] = useState(false)
    const [image, setImage] = useState(false)

    useEffect(async () => {
        var data = await get_homepage_data()
        if (data.overview.data){
            setOverview(data.overview.data)
        }else{
            console.log("Can't get homepage data")
        }
        if (data.overview.img){
            setImage(data.overview.img)
        }else{
            console.log("Can't get homepage data")
        }
    }, [])

    return (
        <Content_Wrapper>
            <div className='homepage_wrapper'>
                <h3 className='homepage_title'>Welcome to Hattavick</h3>
                {(image) ? <div className='img_wrapper'><img className='h_image' src={image} /></div> : <></>}
                {(overview) 
                    ?  overview.map((p) => {
                        if (p === overview[overview.length -1]){
                            return <div key={uuid()}><br/><p className='homepage_overview bottom'>&emsp;{p}</p><br/><br/></div>
                        }else{
                        return <div key={uuid()}><p className='homepage_overview'>&emsp;{p}</p><br/></div> 
                        }
                    })
                    : <></>}
            </div>
        </Content_Wrapper>
    )
}

export default HomePage

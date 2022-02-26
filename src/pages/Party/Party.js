import React, {useState, useEffect} from 'react';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import {get_party_data} from '../../utils/queries';
import './Party.css';

function Party() {

    const [overview, setOverview] = useState(false)

    useEffect(async () => {
        var data = await get_party_data()
        if (data){
            setOverview(data.data)
        }else{
            console.log("Can't get party data")
        }
    }, [])

  return (
      <Content_Wrapper>
        <div className='party_wrapper'>
            <h3 className='party_title'>Party</h3>
        </div>
        <p className='party_overview'>
            {overview}
        </p>
      </Content_Wrapper>
  )
}

export default Party;

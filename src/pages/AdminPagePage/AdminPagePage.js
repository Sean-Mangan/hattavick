import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import AdminPageRow from '../../components/AdminPageRow/AdminPageRow';

function AdminPagePage() {
    
    const [pages, setPages] = useState([])

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/page'

    async function get_pages(){
      try{
          var response = await axios.get(uri, 
          {
              withCredentials: true,
              headers: { crossDomain: true, 'Content-Type': 'application/json' }
          })
          console.log(response.data)
          if (response.data.pages){
              setPages(response.data.pages);
          }
      }catch (err){
          console.log(err)
      }
    }

    useEffect(() => {
        get_pages();
      },[]);

  return (
    <Content_Wrapper>
    <div style={{minHeight:"100vh"}}>
      <h1 style={{textAlign:"center"}}>Page Data</h1>
      {pages.map((page)=> (<AdminPageRow reload={get_pages} page={page}/>))}
    </div>
  </Content_Wrapper>
  );
}

export default AdminPagePage;

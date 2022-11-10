import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import "./CampaignHomePage.css"
import EditIcon from '@mui/icons-material/Edit';
import { Button, TextField } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';
import { TextareaAutosize } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function CampaignHomePage() {

    const [homeData, setHomeData] = useState({img:"", data: "", campaign_name: ""})
    const [img, setImg] = useState("")
    const [err, setErr] = useState("")
    const [editMode, setEditMode] = useState(false)
    const {auth} = useAuth();
    const {campaignId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const hiddenFileInput = React.useRef(null);
    const isAdmin = (auth?.permissions?.admin.includes(campaignId) || auth?.permissions?.owner.includes(campaignId))

    const get_home_data = () => {
      axiosPrivate.get(`${campaignId}/pages/home`)
        .then((resp) => {setHomeData(resp?.data); setImg(resp?.data?.img)})
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    const handleSubmit = (e) => {
      e.preventDefault()

      // Add the new image to the form if it changed
      const form_data = new FormData()
      if (homeData.img !== img){
        form_data.append("image", homeData.img)
      }
      form_data.append("campaign_name", homeData.campaign_name)
      form_data.append("data", homeData.data)

      // Send the new name, overview and image to the server
      axiosPrivate.post(`${campaignId}/pages/home`, form_data)
        .then((resp) => {
          get_home_data()
          setEditMode(!editMode)
        })
        .catch((err) => {
          setErr(err?.response?.data?.error)
        })
    };

    const handleChange = event => {
      const fileUploaded = event.target.files[0];
      setHomeData({...homeData, img: fileUploaded})
      console.log(fileUploaded)
    };

    const handleClick = event => {
      hiddenFileInput.current.click();
    }

    useEffect((() => {
      get_home_data();

    }), [])

  return (
    <div className='campaign-home-wrapper'>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className='home-button-wrapper'>
          {(isAdmin && (homeData?.campaign_name !== ""))
            ? (editMode)
                ? <Button  
                  key={"save"} 
                  type="submit" 
                  className="edit-btn" 
                  variant="contained" 
                  endIcon={<SaveOutlined/>}>Save</Button> 
                : <Button 
                  key={"edit"} 
                  className="edit-btn" 
                  variant="contained" 
                  color="error" 
                  endIcon={<EditIcon/>} 
                  onClick={() => setEditMode(!editMode)}>Edit</Button> 
            : <></>
          }
        </div>
        {(!editMode)
        ?
          <>
            <div className='homepage-title' >
              {homeData.campaign_name}
            </div>
            {(homeData?.img) ? <img className="img-wrapper" src={img} />: <></>}
            <div className="homepage-overview">
              {homeData?.data}
            </div>
          </>
        : 
        <>
          <input 
            className='homepage-title text-field' 
            value={homeData.campaign_name} 
            onChange={(e) => setHomeData({...homeData, "campaign_name": e.target.value})}
          />
          <div className='editable-container'>
            <img className="img-wrapper blur" src={img} /> 
            <div className="upload-btn" onClick={handleClick}>
              Click to Upload a File
              <br/>
              <a className='micro-text'>{homeData?.img?.name}</a>
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{display: 'none'}}
            />
          </div>
          <TextareaAutosize 
          style={{ width: "800px" }}
          value={homeData.data}
          className="homepage-overview auto_resize_text" 
          onChange={(e) => setHomeData({...homeData, data: e.target.value})}
          />
          </>
        }
      </form>
    </div>
  )
}

export default CampaignHomePage
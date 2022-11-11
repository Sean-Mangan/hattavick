import { SaveOutlined } from '@mui/icons-material'
import { Button, TextareaAutosize } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

function WorldLorePage() {

    const [worldData, setWorldData] = useState({img:"", data: ""})
    const [img, setImg] = useState("")
    const [err, setErr] = useState("")
    const [editMode, setEditMode] = useState(false)
    const {auth} = useAuth();
    const {campaignId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const hiddenFileInput = React.useRef(null);
    const isAdmin = (auth?.permissions?.admin.includes(campaignId) || auth?.permissions?.owner.includes(campaignId))

    const get_world_data = () => {
      axiosPrivate.get(`${campaignId}/pages/world`)
        .then((resp) => {setWorldData(resp?.data); setImg(resp?.data?.img)})
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    useEffect(()=>{get_world_data()},[])

    const handleSubmit = (e) => {
      e.preventDefault()

      // Add the new image to the form if it changed
      const form_data = new FormData()
      if (worldData.img !== img){
        form_data.append("image", worldData.img)
      }
      form_data.append("campaign_name", worldData.campaign_name)
      form_data.append("data", worldData.data)

      // Send the new name, overview and image to the server
      axiosPrivate.post(`${campaignId}/pages/world`, form_data)
        .then((resp) => {
          get_world_data()
          setEditMode(!editMode)
        })
        .catch((err) => {
          setErr(err?.response?.data?.error)
        })
    };

    const handleChange = event => {
      const fileUploaded = event.target.files[0];
      setWorldData({...worldData, img: fileUploaded})
    };

    const handleClick = event => {
      hiddenFileInput.current.click();
    }

  return (
    <div className='campaign-home-wrapper'>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className='home-button-wrapper'>
          {(isAdmin && (worldData?.campaign_name !== ""))
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
              World Lore
            </div>
            {(worldData?.img) ? <img className="img-wrapper" src={img} />: <></>}
            <div className="homepage-overview">
              {worldData?.data}
            </div>
          </>
        : 
        <>
          <div className='homepage-title' >
              World Lore
            </div>
          <div className='editable-container'>
            <img className="img-wrapper blur" src={img} /> 
            <div className="upload-btn" onClick={handleClick}>
              Click to Upload a File
              <br/>
              <a className='micro-text'>{worldData?.img?.name}</a>
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
          value={worldData.data}
          className="homepage-overview auto_resize_text" 
          onChange={(e) => setWorldData({...worldData, data: e.target.value})}
          />
          </>
        }
      </form>
    </div>
  )
}

export default WorldLorePage
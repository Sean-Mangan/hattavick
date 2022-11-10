import { Grade, NightShelter, SaveOutlined } from '@mui/icons-material';
import { Button, Grid, Paper, TextareaAutosize, TextField } from '@mui/material';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import EditIcon from '@mui/icons-material/Edit';
import './CharacterPage.css';


function CharacterPage() {

    const {auth} = useAuth()
    const {campaignId, pc, characterId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const isAdmin = auth.permissions.admin.concat(auth.permissions.owner).includes(campaignId)
    const hiddenCharacterFileInput = React.useRef(null);
    const notGiven = "https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png"

    const [charData, setCharData] = useState({image:"", backstory: "", description: "", public:"", name: "", visible: false, job: "", location:""})
    const [img, setImg] = useState("")
    const [err, setErr] = useState("")
    const [delCount, setDelCount] = useState(0)
    const [editMode, setEditMode] = useState(false)

    const get_char_data = () => {
      axiosPrivate.get(`${campaignId}/characters/${pc}/${characterId}`)
        .then((resp) => {setCharData(resp?.data); setImg(resp?.data?.image)})
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    const handleSubmit = (e) => {
      e.preventDefault()

      // Add the new image to the form if it changed
      const form_data = new FormData()
      if (charData.img !== img){
        form_data.append("image", charData.image)
      }
      form_data.append("name", charData.name)
      form_data.append("backstory", charData.backstory)
      form_data.append("description", charData.description)
      form_data.append("public", charData.public)
      form_data.append("name", charData.name)
      form_data.append("visible", charData.visible)
      form_data.append("job", charData.job)
      form_data.append("location", charData.location)

      // Send the new name, overview and image to the server
      axiosPrivate.post(`${campaignId}/characters/npc/${characterId}`, form_data)
        .then((resp) => {
          get_char_data();
          setDelCount(0);
          setEditMode(!editMode)
        })
        .catch((err) => {
          setErr(err?.response?.data?.error)
        })
    };

    useEffect(()=>{
      get_char_data()
    }, [])

    const handleChange = event => {
      const fileUploaded = event.target.files[0];
      setCharData({...charData, image: fileUploaded})
      console.log(fileUploaded)
    };

    const handleClick = event => {
      hiddenCharacterFileInput.current.click();
    }

    const handleDelete = () => {
      if (delCount == 0) {
        setDelCount(1)
      }else{
        axiosPrivate.delete(`${campaignId}/characters/npc/${characterId}`)
        .then((resp) => {window.location.href = `/campaign/${campaignId}/characters/npcs`})
        .catch((err) => {setErr(err?.response?.data?.error)})
      }
    }

  return (
    <div className='pc-wrapper'>
      <form onSubmit={(e)=> handleSubmit(e)}>
        {(pc === "pc" || !(isAdmin))

        ? // The Player Character Page
          <>
            <div className="char-page-pc-space"/>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <div className='char-page-title' style={{fontSize:"40px", letterSpacing:"-3px", marginTop:"0"}}>
                  <strong>
                    {(charData?.name) ? charData?.name : "My Character"}
                  </strong>
                </div>
                <img  className="char-page-pc-img" src={(img) ? img : notGiven} />
                {(pc === "npc") 
                ? 
                  <div className='sm-menu-wrapper'>
                    <strong>Location:</strong> {charData.location}
                    <br/>
                    <strong>job:</strong> {charData.job}
                  </div>
                : <></>
                }
                <div className='char-page-desc-wrapper'>
                  <i>
                    {charData.description}
                  </i>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className='char-page-public-centered-wrap'>
                  <Paper className='char-page-paper-center' elevation={12} style={{paddingBottom:"2em", paddingTop:"1em"}}>
                    <div className='char-page-title char-page-subtitle'>Public backstory</div>
                    <div className='char-page-paper-wrapper'>
                      {charData?.public}
                    </div>
                  </Paper>
                </div>
              </Grid>
            </Grid>
          </>

            
        : // This is the NPC Adminpage
          <>
            <div className='char-page-btn-wrapper'>
              <Button 
              variant="outlined" 
              disabled={!editMode}
              onClick={() => setCharData({...charData, visible: !charData.visible})}>
                {(charData.visible)? "Visible": "Invisible"}
              </Button>
              <Button 
              variant="contained" 
              color="error"
              style={{display: (!editMode) ? "none" : "inline-flex"}}
              onClick={() => handleDelete()}>
                {(delCount==0)? "Delete?" : "Are you Sure?"}
              </Button>
              {(editMode)
                  ? <Button  
                      key={"save"} 
                      type="submit" 
                      className="char-page-edit-btn" 
                      variant="contained" 
                      endIcon={<SaveOutlined/>}>Save</Button> 
                  : <Button 
                      key={"edit"} 
                      className="char-page-edit-btn" 
                      variant="contained" 
                      color="error" 
                      endIcon={<EditIcon/>} 
                      onClick={() => {setEditMode(!editMode); setDelCount(0)}}>Edit</Button>
              }
            </div>
            {!(editMode)
            ?
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <div className='char-page-title' style={{fontSize:"40px", letterSpacing:"-3px", marginTop:"0"}}>
                    <strong>
                      {(charData?.name) ? charData?.name : "My Character"}
                    </strong>
                  </div>
                  <img  className="char-page-pc-img" src={(img) ? img : notGiven} />
                  <div className='sm-menu-wrapper'>
                    <strong>Location:</strong> {charData.location}
                    <br/>
                    <strong>job:</strong> {charData.job}
                  </div>
                  <div className='char-page-desc-wrapper'>
                    <i>
                      {charData.description}
                    </i>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={12} style={{paddingBottom:"2em", paddingTop:"1em"}}>
                  <div className='char-page-title char-page-subtitle'>Private backstory</div>
                    <div className='char-page-paper-wrapper'>
                      {charData?.backstory}
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={12} style={{paddingBottom:"2em", paddingTop:"1em"}}>
                    <div className='char-page-title char-page-subtitle'>Public backstory</div>
                    <div className='char-page-paper-wrapper'>
                      {charData?.public}
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            :
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <input
                    className='char-page-title char-page-text-field'
                    style={{fontSize:"40px", letterSpacing:"-3px"}}
                    value={charData?.name}
                    onChange={(e) => setCharData({...charData, name: e.target.value})}
                    />
                  <div className='char-page-editable-container'>
                    <img className="char-page-img blur" src={(img) ? img : notGiven} /> 
                    <div className="char-page-upload-btn" onClick={handleClick}>
                      Click to Upload a File
                      <br/>
                      <a className='char-page-micro-text'>{charData?.image?.name}</a>
                    </div>
                    <input
                      type="file"
                      ref={hiddenCharacterFileInput}
                      onChange={handleChange}
                      style={{display: 'none'}}
                    />
                  </div>
                  <div className='sm-menu-wrapper'>
                    <TextField 
                    label="Job"
                    style={{paddingBottom:"1em"}}
                    value={charData.job}
                    onChange={(e) => setCharData({...charData, "job": e.target.value})}
                    />
                    <TextField 
                    label="Location"
                    value={charData.location}
                    onChange={(e) => setCharData({...charData, "location": e.target.value})}
                    />
                  </div>
                  <div className='char-page-desc-wrapper'>
                    <TextareaAutosize
                      value={charData.description}
                      style={{textAlign:"center"}}
                      className="char-page-auto-resize-text char-page-overview"
                      onChange={(e) => setCharData({...charData, "description": e.target.value})}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={12} style={{paddingBottom:"2em"}}>
                      <div className='char-page-title char-page-subtitle'>Private backstory</div>
                      <div className='char-page-paper-wrapper'>
                      <TextareaAutosize
                      value={charData.backstory}
                      className="char-page-auto-resize-text char-page-overview"
                      onChange={(e) => setCharData({...charData, "backstory": e.target.value})}
                    />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={12} style={{paddingBottom:"2em"}}>
                    <div className='char-page-title char-page-subtitle'>Public backstory</div>
                    <div className='char-page-paper-wrapper'>
                    <TextareaAutosize
                      value={charData.public}
                      className="char-page-auto-resize-text char-page-overview"
                      onChange={(e) => setCharData({...charData, "public": e.target.value})}
                    />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            }
          </>
        }
      </form>
    </div>
  )
}

export default CharacterPage
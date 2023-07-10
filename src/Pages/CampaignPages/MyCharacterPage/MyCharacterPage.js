import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import "./MyCharacterPage.css"
import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Paper} from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';
import { TextareaAutosize } from '@mui/material';
import { useGetMyCharacterDataQuery, useUpdateMyCharacterMutation } from '../../../features/campaign/campaignApiSlice';

function MyCharacterPage() {

    // Grab dat campaign id and other info
    const {campaignId} = useParams()

    // Get all them datas
    const {data: myChar, isLoading: myCharLoading, isSuccess: myCharSuccess , isError: myCharError} = useGetMyCharacterDataQuery(campaignId)
    
    // State Vars for character, img and editability
    const [charData, setCharData] = useState(myChar)
    const [img, setImg] = useState(charData?.image)
    const [editMode, setEditMode] = useState(false)

    // Mutation for handling character updates
    const [updateMyCharacter] = useUpdateMyCharacterMutation({fixedCacheKey: 'update-my-char'})

    // Button for selecting a character image
    const hiddenCharacterFileInput = React.useRef(null);
    const handleChange = event => {
      const fileUploaded = event.target.files[0];
      setCharData({...charData, image: fileUploaded})
      setImg(URL.createObjectURL(fileUploaded))
    };
    const handleClick = event => {
      hiddenCharacterFileInput.current.click();
    }

    /**
     * Will handle the update for the current character.
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
      e.preventDefault()

      // Add the new image to the form if it changed
      const form_data = new FormData()
      const updateImage = charData.image !== img
      if (updateImage){
        form_data.append("image", charData.image)
      }
      form_data.append("campaign_name", charData.name)
      form_data.append("backstory", charData.backstory)
      form_data.append("description", charData.description)
      form_data.append("public", charData.public)
      form_data.append("name", charData.name)


      // Attempt to perform the update
      try{
        await updateMyCharacter({formData: form_data, id:campaignId}).unwrap()
        setEditMode(!editMode)
        if (updateImage) setImg(URL.createObjectURL(charData.image))
      } catch (err){
      }
    };

  return (
    <div className='pc-wrapper'>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className='btn-wrapper'>
            {(editMode)
                ? <Button  
                    key={"save"} 
                    type="submit" 
                    className="char-edit-btn" 
                    variant="contained" 
                    endIcon={<SaveOutlined/>}>Save</Button> 
                : <Button 
                    key={"edit"} 
                    className="char-edit-btn" 
                    variant="contained" 
                    color="error" 
                    endIcon={<EditIcon/>} 
                    onClick={() => setEditMode(!editMode)}>Edit</Button>
            }
        </div>
        {!(editMode)
        ?
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className='my-char-title' style={{fontSize:"40px", letterSpacing:"-3px", marginTop:"0"}}>
                <strong>
                  {(charData?.name) ? charData?.name : "My Character"}
                </strong>
              </div>
              {(charData?.image) ? <img  className="char-img" src={img} />: <></>}

              <div className='desc-wrapper'>
                <i>
                  {charData.description}
                </i>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{paddingBottom:"2em"}}>
              <div className='my-char-title my-char-subtitle'>Private backstory</div>
                <div className='paper-wrappper'>
                  {charData?.backstory}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{paddingBottom:"2em"}}>
                <div className='my-char-title my-char-subtitle'>Public backstory</div>
                <div className='paper-wrappper'>
                  {charData?.public}
                </div>
              </Paper>
            </Grid>
          </Grid>
        :
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <input
                className='my-char-title text-field'
                style={{fontSize:"40px", letterSpacing:"-3px"}}
                value={charData?.name}
                onChange={(e) => setCharData({...charData, name: e.target.value})}
                />
              <div className='editable-container'>
                <img className="char-img blur" src={img} /> 
                <div className="upload-btn" onClick={handleClick}>
                  Click to Upload a File
                  <br/>
                  <a className='micro-text'>{charData?.image?.name}</a>
                </div>
                <input
                  type="file"
                  ref={hiddenCharacterFileInput}
                  onChange={handleChange}
                  style={{display: 'none'}}
                />
              </div>
              <div className='desc-wrapper'>
                <TextareaAutosize
                  value={charData.description}
                  style={{textAlign:"center"}}
                  className="auto_resize_text mychar-overview"
                  onChange={(e) => setCharData({...charData, "description": e.target.value})}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{paddingBottom:"2em"}}>
                  <div className='my-char-title my-char-subtitle'>Private backstory</div>
                  <div className='paper-wrappper'>
                  <TextareaAutosize
                  value={charData.backstory}
                  className="auto_resize_text mychar-overview"
                  onChange={(e) => setCharData({...charData, "backstory": e.target.value})}
                />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={12} style={{paddingBottom:"2em"}}>
                <div className='my-char-title my-char-subtitle'>Public backstory</div>
                <div className='paper-wrappper'>
                <TextareaAutosize
                  value={charData.public}
                  className="auto_resize_text mychar-overview"
                  onChange={(e) => setCharData({...charData, "public": e.target.value})}
                />
                </div>
              </Paper>
            </Grid>
          </Grid>
      }
      </form>
    </div>
  )
}

export default MyCharacterPage;
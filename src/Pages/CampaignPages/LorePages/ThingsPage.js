import { Button, Card, CardContent, CardMedia, Grid, Paper, TextareaAutosize, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import "./LoreStyle.css";
import useAuth from '../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';


function ThingsPage() {

    const [lore, setLore] = useState([])
    const [filteredLore, setFilteredLore] = useState([])
    const [delCount, setDelCount] = useState(0)
    const [searchName, setSearchName] = useState("")
    const [err, setErr] = useState("")
    const [selectedLore, setSelectedLore] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [img, setImg] = useState("")
    const hiddenCharacterFileInput = React.useRef(null);

    const rightRef = useRef();
    const viewerRef = useRef();
    const bodyRef = useRef();
    const {auth} = useAuth();
    const {campaignId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const isAdmin = (auth?.permissions?.admin.includes(campaignId) || auth?.permissions?.owner.includes(campaignId))

    const DEFAULT_IMAGE = "https://gigcarshare.com/wp-content/plugins/complianz-gdpr-premium/core/assets/images/placeholder.jpg"

    const filter = (e) => {
        const keyword = e.target.value;
        if (keyword !== '') {
            const results = lore.filter((lore_item) => {
            return lore_item.name.toLowerCase().includes(keyword.toLowerCase()) && !(lore_item.name.includes("Unknown"));
            });
            setFilteredLore(results);
        } else {
            setFilteredLore(lore);
        }
      setSearchName(keyword);
    };

    const showRight = () =>{
        rightRef.current.classList.toggle("show-right")
    }

    const closePreview = () =>{
        viewerRef.current.classList.toggle("show-img")
        bodyRef.current.classList.toggle("no-scroll")
        bodyRef.current.classList.toggle("no-scroll")
    }

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setSelectedLore({...selectedLore, image: fileUploaded})
    };
  
    const handleClick = event => {
        hiddenCharacterFileInput.current.click();
    }

    const get_things = () =>{
        axiosPrivate.get(`${campaignId}/lore/thing`)
        .then((resp) => {
            setLore(resp?.data);
            setFilteredLore(resp?.data)
        })
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    const createNewLore = () =>{
        axiosPrivate.post(`${campaignId}/lore/thing`)
        .then((resp) => {
            get_things()
        })
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    const handleDelete = (lore_id) => {
        if (delCount === 0){
            setDelCount(1)
        }else{
            axiosPrivate.delete(`${campaignId}/lore/thing/${selectedLore.lore_id}`)
            .then((resp) => {
                get_things();
                setSelectedLore({})
                setDelCount(0)
                setEditMode(!editMode)
                showRight()
            })
            .catch((err) => {setErr(err?.response?.data?.error)})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
  
        // Add the new image to the form if it changed
        const form_data = new FormData()
        if (selectedLore.img !== img){
          form_data.append("image", selectedLore.image)
        }
        form_data.append("name", selectedLore.name)
        form_data.append("private", selectedLore.private)
        form_data.append("about", selectedLore.about)
        form_data.append("visible", selectedLore.visible)
  
        // Send the new name, overview and image to the server
        axiosPrivate.post(`${campaignId}/lore/thing/${selectedLore.lore_id}`, form_data)
          .then((resp) => {
            get_things();
            setSelectedLore({})
            setDelCount(0);
            setEditMode(!editMode)
          })
          .catch((err) => {
            setErr(err?.response?.data?.error)
          })
    };

    useEffect(()=>{
        get_things()
    },[])

  return (
    <div className='lore-wrapper' ref={bodyRef}>
        <div className='fullscreen-wrap' ref={viewerRef}>
            <div className='large-img-wrap'>
                <img src={(img) ? img : DEFAULT_IMAGE} className="preview-img"/>
                <CloseIcon 
                className="close-img-btn" 
                style={{fontSize: 'min(10vw, 48px)', fontWeight:"bold"}}
                onClick={()=> closePreview()}
                />
            </div>
        </div>
        <div className='lore-title'>Things</div>
        <div className='lore-body-wrap'>
            <Paper className='lore-left' elevation={12}>
                <div className='lore-options'>
                <TextField 
                        label="Search" 
                        value={searchName} 
                        onChange={filter}
                    />
                    {(isAdmin) ?
                        <Button
                        variant="contained"
                        color="primary"
                        className='lore-add-btn'
                        onClick={() => createNewLore()}
                        >
                            <AddIcon />
                        </Button>
                        : <></>
                    }
                </div>
                <div className='lore-left-wrap'>
                    {(filteredLore.length !== 0)
                    
                    ? filteredLore.map((lore_item) => {
                        return (
                            <Card 
                            className='lore-item-card' 
                            key={lore_item.lore_id} 
                            onClick={()=>{   
                                if (!lore_item?.default){
                                    setSelectedLore(lore_item); 
                                    setImg(lore_item?.image); 
                                    setDelCount(0); 
                                    setEditMode(false); 
                                    showRight()
                                }
                                }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={(lore_item?.image) ? lore_item?.image : DEFAULT_IMAGE}
                                    alt="Lore Image"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {lore_item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {lore_item.about}
                                </Typography>
                            </CardContent>
                            </Card>
                            )
                        })
                    : <div>There are no items to display</div>
                    }
                </div>
            </Paper>

            <Paper className='lore-right' elevation={12} ref={rightRef}>
                <form onSubmit={(e) => handleSubmit(e)} style={{height:"100%", width:"100%"}}>
                    <div className='close-btn-wrap'>
                        <Button onClick={()=>showRight()} className="close-btn"><CloseIcon style={{fontSize: 'min(10vw, 48px)', fontWeight:"bold"}}/></Button>
                    </div>
                {(isAdmin && selectedLore?.lore_id)
                ? <div className='lore-btn-wrap'>
                    <Button 
                    variant="contained" 
                    disabled={!editMode}
                    onClick={() => {setSelectedLore({...selectedLore, visible: !selectedLore?.visible})}}>
                        {(selectedLore?.visible) ? "visible" : "invisible"}
                    </Button>
                    <Button 
                    variant="contained" 
                    disabled={!editMode}
                    color="error"
                    onClick={() => handleDelete(selectedLore?.lore_id)}>
                        {(delCount==0)? "Delete?" : "Are You Sure?"}
                    </Button>

                    {(editMode)
                    ?   <Button 
                        key="save-btn"
                        variant="contained" 
                        type="submit"
                        color="primary">
                            Save
                        </Button>
                    :
                        <Button 
                        key="edit-btn"
                        variant="contained" 
                        color="secondary"
                        onClick={() => setEditMode(!editMode)}>
                            Edit
                        </Button>
                    }
                    </div>
                : <></>
                }

                {(!editMode)
                ?

                // An item has been select
                <>
                    {(selectedLore?.lore_id) 
                        ?
                        <>
                            <div className='lore-selected'>
                                    {selectedLore.name}
                            </div> 
                            <div className='selected-wrapper'>
                                <img src={(img) ? img : DEFAULT_IMAGE} onClick={()=>closePreview()} className="selected-image"/>
                                <div><strong>About:</strong></div>
                                <div className='lore-about'>
                                    {selectedLore?.about}
                                </div>

                                {(isAdmin)
                                ?  <>
                                    <div>
                                    <div><strong>Private:</strong>
                                    </div>
                                    <div className='lore-about'>
                                    {selectedLore?.private}
                                    </div>
                                    </div>
                                    </>
                                : <></>
                                }
                            </div>
                        </>

                        // There has been no selected item yet
                        :
                        <div className='lore-mid-wrap'>
                            <div className='lore-mid-content'>
                                <div className='lore-selected'>
                                        Things Overview
                                </div> 
                                <div className='selected-wrapper'>
                                    <img 
                                    className="selected-image" 
                                    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f22c124e-bb2d-4807-800c-ef4cac38b51e/dddq7o6-55b4b3f7-4331-46a2-b959-90c25434fec8.jpg/v1/fill/w_1024,h_1024,q_75,strp/dnd_inventory_update_by_oixxo_dddq7o6-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcL2YyMmMxMjRlLWJiMmQtNDgwNy04MDBjLWVmNGNhYzM4YjUxZVwvZGRkcTdvNi01NWI0YjNmNy00MzMxLTQ2YTItYjk1OS05MGMyNTQzNGZlYzguanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Fx2_gZVpZbwUP8IolBKcm3hIBA88KxcSY4LeToJMCt0"
                                    />
                                    <div className='lore-about'>
                                        Here be stored information on items of interest; magical items recently discovered, cursed items with an unknown effect, amongst other useful pieces of information.
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </>
                :
                    <>
                        <input
                        className='char-page-title char-page-text-field'
                        style={{fontSize:"50px"}}
                        value={selectedLore.name}
                        onChange={(e) => setSelectedLore({...selectedLore, name: e.target.value})}
                        />
                        <div className='char-page-editable-container'>
                            <img className="char-page-img blur" src={(img) ? img : DEFAULT_IMAGE} /> 
                            <div className="char-page-upload-btn" onClick={handleClick}>
                                Click to Upload a File
                                <br/>
                                <a className='char-page-micro-text'>{selectedLore?.image?.name}</a>
                            </div>
                            <input
                            type="file"
                            ref={hiddenCharacterFileInput}
                            onChange={handleChange}
                            style={{display: 'none'}}
                            />
                        </div>
                        <div>
                            <strong>About:</strong>
                        </div>
                        <TextareaAutosize
                            value={selectedLore.about}
                            style={{textAlign:"center"}}
                            className="lore-page-auto-resize-text char-page-overview"
                            onChange={(e) => setSelectedLore({...selectedLore, "about": e.target.value})}
                            />
                        <div>
                            <div>
                                <strong>Private:</strong>
                            </div>
                            <TextareaAutosize
                            value={selectedLore.private}
                            style={{textAlign:"center"}}
                            className="lore-page-auto-resize-text char-page-overview"
                            onChange={(e) => setSelectedLore({...selectedLore, "private": e.target.value})}
                            />
                        </div>
                    </>
                }
                </form>
            </Paper>
        </div>
    </div>
  )
}

export default ThingsPage
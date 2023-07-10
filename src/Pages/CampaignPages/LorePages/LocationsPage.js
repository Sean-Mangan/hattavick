import { Alert, AlertTitle, Button, Card, CardContent, CardMedia, Paper, TextareaAutosize, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import "./LoreStyle.css";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateLocationMutation, useDeleteLocationMutation, useGetLocationQuery, useUpdateLocationMutation } from '../../../features/campaign/campaignApiSlice';
import { useOutletContext } from 'react-router-dom';


function LocationsPage() {

    // Some helpful hooks to get data
    const {isAdmin, campaignId, error, resetError} = useOutletContext()
    const {data: lore, isLoading} = useGetLocationQuery(campaignId)
    const [updateLocation] = useUpdateLocationMutation({fixedCacheKey: 'update-location'})
    const [createLocation] = useCreateLocationMutation({fixedCacheKey: 'create-location'})
    const [deleteLocation] = useDeleteLocationMutation({fixedCacheKey: 'delete-location'})

    // Sate variables
    const [filteredLore, setFilteredLore] = useState((isLoading) ? [] : lore)
    const [delCount, setDelCount] = useState(0)
    const [searchName, setSearchName] = useState("")
    const [selectedLore, setSelectedLore] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [img, setImg] = useState("")

    // Will handle changing the image of the selected loew
    const hiddenCharacterFileInput = React.useRef(null);
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setSelectedLore({...selectedLore, image: fileUploaded})
        setImg(URL.createObjectURL(fileUploaded))
    };
    const handleClick = event => {
        hiddenCharacterFileInput.current.click();
    }

    // Handle dynamic styling for selecting images
    const rightRef = useRef();
    const viewerRef = useRef();
    const bodyRef = useRef();
    const showRight = () =>{
        rightRef.current.classList.toggle("show-right")
    }
    const closePreview = () =>{
        viewerRef.current.classList.toggle("show-img")
        bodyRef.current.classList.toggle("no-scroll")
        bodyRef.current.classList.toggle("no-scroll")
    }

    const DEFAULT_IMAGE = "https://gigcarshare.com/wp-content/plugins/complianz-gdpr-premium/core/assets/images/placeholder.jpg"

    /**
     * Small helper function to filter out all pieces of lore that do not match
     * @param {*} e 
     */
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

    /**
     * Will handle creating a new piece of lore
     */
    const createNewLore = async () =>{
        try{
            await createLocation(campaignId).unwrap()
            setFilteredLore(lore)
            setSearchName("")
        } catch{
        }
    }

    /**
     * Will handle deleting the selected piece of lore
     * @param {*} lore_id 
     */
    const handleDelete = async (lore_id) => {
        if (delCount === 0){
            setDelCount(1)
        }else{
            try{
                await deleteLocation({campaignId, lore_id}).unwrap()
                setSelectedLore({})
                setDelCount(0)
                setEditMode(!editMode)
                showRight()
            }catch{
            }
        }
    }

    /**
     * Will handle updating the slected piece of lore
     * @param {*} e 
     */
    const handleSubmit = async(e) => {
        e.preventDefault()
  
        // Add the new image to the form if it changed
        const form_data = new FormData()
        const updatedImage = selectedLore.image !== img
        if (selectedLore.image !== img){
          form_data.append("image", selectedLore.image)
        }
        form_data.append("name", selectedLore.name)
        form_data.append("private", selectedLore.private)
        form_data.append("about", selectedLore.about)
        form_data.append("visible", selectedLore.visible)

        // Attempt to perform the locations update
        try{
            await updateLocation({campaignId, formData: form_data, lore_id: selectedLore.lore_id}).unwrap()
            if (updatedImage) {
                setImg(URL.createObjectURL(selectedLore.image))

                // Attempt to copy the lore and update the image of the selected lore
                let newLore = []
                lore.forEach((elem) => {
                    if (elem.lore_id === selectedLore.lore_id) {
                        elem = {...elem, image: URL.createObjectURL(selectedLore.image)}
                    }
                    newLore.push(elem)
                })
            }
            setEditMode(!editMode)
        } catch (e) {
        }
    };

    // In the event of a lore change, reset the filtered data
    useEffect(() => {
        setFilteredLore(lore)
        setSearchName("")
    }, [lore])

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
        <div className='lore-title'>Locations</div>
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
                    {
                        (error) ?
                            <Alert
                            className='campaign_create_err lore-err'
                            onClose={() => {resetError()}}
                            style={(error) ? {textAlign:"left"} : {display: "none"}} 
                            severity="error"
                            >
                                <AlertTitle>Error</AlertTitle>
                                <strong>Oops, an error occured</strong> — {error}
                            </Alert> 
                            : <></>
                    }
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
                                        Locations Overview
                                </div> 
                                <div className='selected-wrapper'>
                                    <img 
                                    className="selected-image" 
                                    src="https://cdn.britannica.com/80/149180-050-23E41CF0/topographic-map.jpg"
                                    />
                                    <div className='lore-about'>
                                        Here you can find location information for your campaign. This may include images, maps, descriptions and more. 
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

export default LocationsPage
import {Grid, Paper,} from '@mui/material';
import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import './CharacterPage.css';
import { useGetPartyDataQuery } from '../../../features/campaign/campaignApiSlice';


function PlayerCharacterPage() {

    // Get campaign id and if the user is an admin
    const {campaignId} = useOutletContext()
    const {characterId} = useParams()

    // Get the character in question and display the info
    const {data: party, isLoading: partyLoading, isSuccess: partySuccess , isError: partyError} = useGetPartyDataQuery(campaignId)
    const filteredCharacters = party.filter(character => character.character_id === characterId)
    const character = (filteredCharacters.length === 1) ? filteredCharacters[0] : {}
    const notGiven = "https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png"

  return (
    <div className='pc-wrapper'>
      <div className="char-page-pc-space"/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className='char-page-title' style={{fontSize:"40px", letterSpacing:"-3px", marginTop:"0"}}>
            <strong>
              {(character?.name) ? character?.name : "Not Named"}
            </strong>
          </div>
          <img  className="char-page-pc-img" src={(character?.image) ? character.image : notGiven} />
          <div className='char-page-desc-wrapper'>
            <i>
              {character.description}
            </i>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className='char-page-public-centered-wrap'>
            <Paper className='char-page-paper-center' elevation={12} style={{paddingBottom:"2em", paddingTop:"1em"}}>
              <div className='char-page-title char-page-subtitle'>Public backstory</div>
              <div className='char-page-paper-wrapper'>
                {character?.public}
              </div>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default PlayerCharacterPage
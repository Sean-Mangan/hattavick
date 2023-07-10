import React, {useState, useEffect} from 'react'
import "./PartyPage.css"
import { Link, useParams } from 'react-router-dom';
import { Grid, Hidden, Paper } from '@mui/material';
import {v4} from "uuid";
import { useGetPartyDataQuery } from '../../../features/campaign/campaignApiSlice';

function PartyPage() {

    // Get all them datas
    const {campaignId} = useParams()
    const {data: party, isLoading: partyLoading, isSuccess: partySuccess , isError: partyError} = useGetPartyDataQuery(campaignId)

    // Set state variables for characters and error
    const [charData, setCharData] = useState(party)
    const [err, setErr] = useState("")

    const CharacterRow = ({character, idx}) =>{
        return (
        <Paper elevation={12} className="character-party-wrapper">
            <Grid container>
                {(idx%2 === 0)
                ?
                    <>
                        <Grid item xs={12} md={6}>
                            <div className='title-img-wrapper'>
                                <div className='char-name-title'>
                                    {character.name}
                                </div>
                                <div className='char-img-wrapper'>
                                    <img alt="" className="char-party-img" src={character.image} />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='title-desc-wrapper'>
                                <div className='title-desc-text'> 
                                    <i>
                                        {character.description.substring(0,355)+"..."}
                                    </i>
                                </div>
                            </div>
                        </Grid>
                    </>
                :
                    <>
                        <Hidden mdDown>
                            <Grid item xs={12} md={6}>
                                <div className='title-desc-wrapper'>
                                    <div className='title-desc-text'> 
                                        <i>
                                        {character.description.substring(0,355)+"..."}
                                        </i>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className='title-img-wrapper'>
                                    <div className='char-name-title'>
                                    {character.name}
                                    </div>
                                    <div className='char-img-wrapper'>
                                        <img alt="" className="char-party-img" src={character.image} />
                                    </div>
                                </div>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid item xs={12} md={6}>
                                <div className='title-img-wrapper'>
                                    <div className='char-name-title'>
                                        {character.name}
                                    </div>
                                    <div className='char-img-wrapper'>
                                        <img alt="" className="char-party-img" src={character.image} />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className='title-desc-wrapper'>
                                    <div className='title-desc-text'> 
                                        <i>
                                            {character.description.substring(0,355)+"..."}
                                        </i>
                                    </div>
                                </div>
                            </Grid>
                        </Hidden>
                    </>
                }
            </Grid>
        </Paper>
        )
    } 

  return (
    <div>
        <div className='party-title'>
            Party
        </div>
        {charData.map((char, idx) => 
            <Link key={v4()} style={{textDecoration:"None"}} to={(char.character_id) ? `/campaign/${campaignId}/characters/pc/${char.character_id}` : "#"}>
                <CharacterRow key={v4()} character={char} idx={idx}/>
            </Link>)
        }
    </div>
  )
}

export default PartyPage
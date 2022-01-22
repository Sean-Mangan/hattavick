import React from 'react';
import { Grid, Hidden } from '@mui/material';

import './Content_Wrapper.css';

function Content_Wrapper({children}) {

    return (
        <Grid container direction="row" alignItems="stretch">
            <Hidden only="xs">
                <Grid className='side' item  md={3} sm={2} xs={0}/>
            </Hidden>
            <Grid item md={6} sm={8} xs={12}>
                {children}
            </Grid>
            <Hidden only="xs">
                <Grid item className='side' md={3} sm={2} xs={0}/>
            </Hidden>
        </Grid>
    )
}

export default Content_Wrapper

import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'


function Example() {
    let { name } = useParams();

    return (

        
        <h1> Name: {name} </h1>
    )
}

export default Example
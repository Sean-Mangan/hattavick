import axios from 'axios';
axios.defaults.withCredentials = true;

var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/'


export async function get_homepage_data(){
    try{
        var response = await axios.post(uri+"api/page",
        {
            page : "homepage"
        },
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_worldlore_data(){
    try{
        var response = await axios.post(uri+"api/page",
        {
            page : "world_lore"
        },
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function create_note(){
    try{
        var response = await axios.post(uri+"api/notes",{"title": "New Note","content":"New Note"},
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_notespage_data(){
    try{
        var response = await axios.post(uri+"api/page",
        {
            page : "mynotes"
        },
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data.overview
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_player_notes(){
    try{
        var response = await axios.get(uri+"api/notes",
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data){
            return response.data
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_pc_data(){
    try{
        var response = await axios.get(uri+"api/player_character",
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })
        if (response.data.player_name){
            return response.data
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_npcpage_data(){
    try{
        var response = await axios.post(uri+"api/page",
        {
            page : "npcs"
        },
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data.overview
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}


export async function get_party_data(){
    try{
        var response = await axios.post(uri+"api/page",
        {
            page : "party"
        },
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data.overview
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_session_data(){
    try{
        var response = await axios.post(uri+"api/page",
        {
            page : "sessions"
        },
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data.overview){
            return response.data.overview
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}

export async function get_sessions(){
    try{
        var response = await axios.get(uri+"api/sessions",
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })

        if (response.data){
            return response.data
        }else{
            return false
        }
    }catch (err){
        console.log(err)
        return false
    }
}
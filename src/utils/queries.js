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
            return response.data.overview
        }else{
            return false
        }
    }catch (err){
        console.log("poop")
        return false
    }
}
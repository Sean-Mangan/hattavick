import { Outlet, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ValidateCampaignUser = () => {
    /* Small helper function to ensure that the client has permission to view the given campaign */
    const {auth} =  useAuth()
    const {campaignId} = useParams()
    const all_campaigns = auth.permissions.owner.concat(auth.permissions.admin, auth.permissions.player)
    return(
        <>
        {(!all_campaigns.includes(campaignId))
            ? <div style={{textAlign:"center"}}><h1>You Do not Have Permission to View this Campaign. Bitch</h1></div>
            : <Outlet />
        }
        </>
    )
}

export default ValidateCampaignUser
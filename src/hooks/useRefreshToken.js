import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refreshToken', {
            withCredentials: true
        });
        setAuth(prev => {
            return { ...prev, accessToken: response.data.accessToken, permissions: response.data.permissions }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
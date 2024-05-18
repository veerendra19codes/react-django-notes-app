import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAurthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAurthorized(false));
    })

    const refreshtoken = async () => {
        const refreshtoken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshtoken,
            });
            if (res.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAurthorized(true)
            }
            else {
                setIsAurthorized(false)
            }
        }
        catch (error) {
            console.log("error in refreshing token:", error)
            setIsAurthorized(false)
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAurthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshtoken();
        }
        else {
            setIsAurthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
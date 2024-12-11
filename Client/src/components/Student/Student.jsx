import React, { useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";

const student = () => {
    const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    
    useEffect(() => {
        if (!currentUser) {
        navigate("/");
        } else{
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                  },
                  (error) => {
                    console.error("Error getting location:", error);
                  }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }
    }, [currentUser]);
    
    return (
        <div>
        <h1>Student</h1>
        {location.latitude && location.longitude && (
            <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
            </p>
        )}
        </div>
    );
}

export default student;
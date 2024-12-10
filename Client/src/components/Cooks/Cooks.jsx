import React, { useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { AuthContext } from "../../contexts/AccountContext";

const student = () => {
    const { apiCall, loading, error } = useApi();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!currentUser) {
        navigate("/");
        }
    }, [currentUser]);
    
    return (
        <div>
        <h1>Cook</h1>
        </div>
    );
}

export default student;
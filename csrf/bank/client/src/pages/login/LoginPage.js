import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storeAccountId } from "../../utils/session_storage/sessionStorage";
import { getUrl } from "../../utils/url/url";
import "./login_page.css";

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const handleLogin = () => {
        const accountId = document.getElementById("login-page-account-id").value;
        const password = document.getElementById("login-page-password").value;

        const url = getUrl(`/login?account_id=${accountId}&password=${password}`);
        axios.post(url, {}, { withCredentials: true })
            .then(() => {
                storeAccountId(accountId);
                console.log("cookie:", document.cookie);
                navigate("/balance");
            })
            .catch((err) => {
                setErrorMessage(err.response.data.message)
            });
    };

    return (
        <div>
            <label htmlFor="login-page-account-id">Account ID:</label><br/>
            <input
                type="text"
                id="login-page-account-id"
            /><br/>
            <label htmlFor="login-page-password">Password:</label><br/>
            <input
                type="password"
                id="login-page-password"
            /><br/>
            <div className="login-page-space-1"/>
            <button onClick={handleLogin}>Login</button>
            <div className="login-page-space-2"/>
            <div className="login-page-error">
                {errorMessage}
            </div>
        </div>
    );
};

export default LoginPage;

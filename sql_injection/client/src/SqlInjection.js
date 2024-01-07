import { useState } from "react";
import axios from "axios";
import { getUrl } from "./utils";
import "./sql_injection.css";

const SqlInjection = () => {
    const [userProfiles, setUserProfiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const handleShowMyProfile = () => {
        const username = document.getElementById("sql-injection-username").value;
        const password = document.getElementById("sql-injection-password").value;

        axios.get(getUrl(`/user-profile?username=${username}&password=${password}`))
            .then((res) => {
                setUserProfiles(res.data);
                setErrorMessage("");
            })
            .catch((err) => {
                setUserProfiles([]);
                setErrorMessage(err.response.data.message);
            });
    };

    return (
        <div>
            <label htmlFor="sql-injection-username">Username:</label><br/>
            <input
                type="text"
                id="sql-injection-username"
            /><br/>
            <label htmlFor="sql-injection-password">Password:</label><br/>
            <input
                type="password"
                id="sql-injection-password"
            /><br/>
            <div className="sql-injection-space-1"/>
            <button onClick={handleShowMyProfile}>Show My Profile</button>
            <div className="sql-injection-space-2"/>
            {
                userProfiles.length === 0 ?
                    null
                    :
                    <table>
                        <thead>
                            <tr>
                                <th className="sql-injection-table-th">ID</th>
                                <th className="sql-injection-table-th">Username</th>
                                <th className="sql-injection-table-th">Password</th>
                                <th className="sql-injection-table-th">Job Title</th>
                                <th className="sql-injection-table-th">Mobile Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userProfiles.map((userProfile, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="sql-injection-table-td">{userProfile.id}</td>
                                            <td className="sql-injection-table-td">{userProfile.username}</td>
                                            <td className="sql-injection-table-td">{userProfile.password}</td>
                                            <td className="sql-injection-table-td">{userProfile.job_title}</td>
                                            <td className="sql-injection-table-td">{userProfile.mobile_number}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>   
            }
            {
                errorMessage.length === 0 ?
                    null
                    :
                    <div className="sql-injection-error-message">{errorMessage}</div>
            }
        </div>
    );
};

export default SqlInjection;

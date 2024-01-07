import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadAccountId } from "../../utils/session_storage/sessionStorage";
import { handleLogout } from "../../utils/logout/logout";
import { getUrl } from "../../utils/url/url";
import "./transfer_page.css";


const TransferPage = () => {
    const [srcAccountId, setSrcAccountId] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleTransfer = () => {
        const dstAccountId = document.getElementById("transfer-page-destination-account-id").value;
        const amount = document.getElementById("transfer-page-amount").value;

        const url = getUrl(`/transfer?src_account_id=${srcAccountId}&dst_account_id=${dstAccountId}&amount=${amount}`);
        axios.post(url, {}, { withCredentials: true })
            .then(() => {
                setMessage( <div className="transfer-page-success">success</div> );
            })
            .catch((err) => {
                setMessage( <div className="transfer-page-error">{err.response.data.message}</div> );
                if (err.response.status === 401) {
                    navigate("/login");
                }
            });
    };

    const handleBalance = () => {
        navigate("/balance");
    };

    useEffect(() => {
        const srcAccountId = loadAccountId();
        if (srcAccountId === null) {
            navigate("/login");
            return;
        }

        setSrcAccountId(srcAccountId);
    }, [navigate]);

    return (
        <div>
            {
                srcAccountId === null ?
                    null
                    :
                    <div>
                        <div>Source Account ID:</div>
                        <div>{srcAccountId}</div>
                        <label htmlFor="transfer-page-destination-account-id">Destination Account ID:</label><br/>
                        <input
                            type="text"
                            id="transfer-page-destination-account-id"
                        /><br/>
                        <label htmlFor="transfer-page-amount">Amount:</label><br/>
                        <input
                            type="number"
                            id="transfer-page-amount"
                        /><br/>
                        <div className="transfer-page-space-1"/>
                        <button onClick={handleTransfer}>Transfer</button><br/>
                        <div className="transfer-page-space-2"/>
                        <button onClick={handleBalance}>My Balance</button>
                        <span>&ensp;</span>
                        <button onClick={() => handleLogout(navigate)}>Logout</button>
                        <div className="transfer-page-space-3"/>
                        {message}
                    </div>
            }
        </div>
    );
};

export default TransferPage;

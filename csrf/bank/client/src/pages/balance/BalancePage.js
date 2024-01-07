import { useEffect, useState } from "react";
import axios from "axios";
import { loadAccountId } from "../../utils/session_storage/sessionStorage";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logout/logout";
import { getUrl } from "../../utils/url/url";

const BalancePage = () => {
    const [hasAccountId, setHasAccountId] = useState(false);
    const [balance, setBalance] = useState(null);
    const navigate = useNavigate();
    
    const handleTransfer = () => {
        navigate("/transfer");
    };

    useEffect(() => {
        const accountId = loadAccountId();
        if (accountId === null) {
            navigate("/login");
            return;
        }

        setHasAccountId(true);
        const url = getUrl(`/balance?account_id=${accountId}`);
        axios.get(url, { withCredentials: true })
            .then((res) => {
                const data = res.data;
                setBalance(data.balance);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate("/login");
                }
            });
    }, [navigate]);

    return (
        <div>
            {
                !hasAccountId ?
                    null
                    :
                    <div>
                        <h3>
                            Your balance is {balance}
                        </h3>
                        <button onClick={handleTransfer}>Transfer</button>
                        <span>&ensp;</span>
                        <button onClick={() => handleLogout(navigate)}>Logout</button>
                    </div>
            }
        </div>
    );
};

export default BalancePage;

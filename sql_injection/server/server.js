
const express = require("express");
const bodyParser = require("body-parser");
const cors  = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pg = require("pg");

const config = {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "sql_injection",
    port: 5432
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) {
        throw err;
    }
});

/*
const isAlphaNumeric = (str) => {
    // return str.match(/^[0-9a-z]+$/i);
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (
            !(code > 47 && code < 58) &&
            !(code > 64 && code < 91) &&
            !(code > 96 && code < 123)
        ) {
            return false;
        }
    }

    return true;
};
*/

// ' OR true --
// http://localhost:5000/user-profile?username=%27%20OR%20true%20--&password=345
app.get("/user-profile", (request, response) => {
    const username = request.query.username;
    const password = request.query.password;

    /*
    if (!isAlphaNumeric(username) || !isAlphaNumeric(password)) {
        response.status(401).send({ message: "wrong username/password combination" });
        console.log("bad username/password");
        return;
    }
    */

    const query = `SELECT * FROM UserProfiles WHERE username='${username}' AND password='${password}'`;
    console.log("query:", query);

    client.query(query)
        .then((res) => {
            const rows = res.rows;
            if (rows.length > 0) {
                response.status(200).send(rows);
            } else {
                response.status(401).send({ message: "wrong username/password combination" });
            }
        })
        .catch((err) => {
            response.status(500).send({ message: "internal server error" });
            console.error(err);
        });
});

const port = 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

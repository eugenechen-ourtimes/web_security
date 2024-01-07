
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pg = require("pg");

const config = {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "xss",
    port: 5432
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) {
        throw err;
    }
});

app.get("/comments", (request, response) => {
    const query = "SELECT * FROM Comments";
    console.log("query:", query);

    client.query(query)
        .then((res) => {
            const rows = res.rows;
            response.status(200).send(rows);
        })
        .catch((err) => {
            response.status(500).send({ message: "internal server error" });
            console.error(err);
        });
});

app.post("/comment", (request, response) => {
    const content = request.query.content;
    if (content === undefined) {
        response.status(400).send({ message: "missing content" });
        return;
    }

    const text = "INSERT INTO Comments(content) VALUES($1)";
    const values = [content];
    console.log("text:", text);
    console.log("values:", values);

    client.query(text, values)
        .then(() => {
            response.status(200).send({});
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

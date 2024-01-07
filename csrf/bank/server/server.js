
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:3001", "http://localhost:3002"],
    credentials: true
};

app.use(cors(corsOptions));

const pg = require("pg");

const config = {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "csrf",
    port: 5432
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) {
        throw err;
    }
});

const fetchAccountStatus = {
    SUCCESS: 0,
    INTERNAL_SERVER_ERROR: 1,
    WRONG_ACCOUNT_ID_PASSWORD_COMBINATION: 2
};

const fetchAccount = async (accountId, password) => {
    const text = "SELECT null FROM Accounts WHERE account_id = $1 AND password = $2";
    const values = [accountId, password];
    console.log("text:", text);
    console.log("values:", values);

    try {
        const response = await client.query(text, values);
        const rows = response.rows;
        if (rows.length === 0) {
            return {
                status: fetchAccountStatus.WRONG_ACCOUNT_ID_PASSWORD_COMBINATION
            };
        }

        return {
            status: fetchAccountStatus.SUCCESS
        };
    } catch (error) {
        console.error(error);
        return {
            status: fetchAccountStatus.INTERNAL_SERVER_ERROR
        };
    }
};

const sessionIds = new Map();

const crypto = require("crypto");
const getSessionId = () => {
    return crypto.randomBytes(16).toString("hex");
};

app.post("/login", async (req, res) => {
    console.log("request:", "/login");

    const accountId = req.query.account_id;
    const password = req.query.password;
    if (accountId === undefined || password === undefined) {
        res.status(400).send({ message: "missing account ID or password" });
        return;
    }

    const fetchAccountResult = await fetchAccount(accountId, password);
    if (fetchAccountResult.status === fetchAccountStatus.INTERNAL_SERVER_ERROR) {
        res.status(500).send({ message: "internal server error" });
        return;
    }

    if (fetchAccountResult.status === fetchAccountStatus.WRONG_ACCOUNT_ID_PASSWORD_COMBINATION) {
        res.status(401).send({ message: "wrong account ID / password combination" });
        return;
    }

    const sessiodId = getSessionId();
    sessionIds.set(accountId, sessiodId);

    res.cookie("session_id", sessiodId);
    res.status(200).send({});
});

app.post("/logout", (req, res) => {
    console.log("request:", "/logout");

    res.clearCookie("session_id");

    const accountId = req.query.account_id;
    if (accountId === undefined) {
        res.status(400).send({ message: "missing account ID" });
        return;
    }

    const sessiodId = req.cookies.session_id;
    const recordedSessionId = sessionIds.get(accountId);
    if (sessiodId === undefined || recordedSessionId === undefined) {
        res.status(401).send({ message: "not logged in" });
        return;
    }

    if (sessiodId !== recordedSessionId) {
        res.status(401).send({ message: "wrong session ID" });
        return;
    }

    sessionIds.delete(accountId);
    res.status(200).send({});
});

const fetchBalanceStatus = {
    SUCCESS: 0,
    INTERNAL_SERVER_ERROR: 1,
    ACCOUNT_DOES_NOT_EXIST: 2
};

const fetchBalance = async (accountId) => {
    const text = "SELECT balance FROM Accounts WHERE account_id = $1";
    const values = [accountId];
    console.log("text:", text);
    console.log("values:", values);

    try {
        const response = await client.query(text, values);
        const rows = response.rows;
        if (rows.length === 0) {
            return {
                status: fetchBalanceStatus.ACCOUNT_DOES_NOT_EXIST,
                balance: 0
            };
        }

        return {
            status: fetchBalanceStatus.SUCCESS,
            balance: rows[0].balance
        };
    } catch (error) {
        console.error(error);
        return {
            status: fetchBalanceStatus.INTERNAL_SERVER_ERROR,
            balance: 0
        };
    }
};

app.get("/balance", async (req, res) => {
    console.log("request:", "/balance");

    const accountId = req.query.account_id;
    if (accountId === undefined) {
        res.status(400).send({ message: "missing account ID" });
        return;
    }

    const sessiodId = req.cookies.session_id;
    const recordedSessionId = sessionIds.get(accountId);
    if (sessiodId === undefined || recordedSessionId === undefined) {
        res.status(401).send({ message: "not logged in" });
        return;
    }

    if (sessiodId !== recordedSessionId) {
        res.status(401).send({ message: "wrong session ID" });
        return;
    }

    const fetchBalanceResult = await fetchBalance(accountId);
    if (fetchBalanceResult.status === fetchBalanceStatus.INTERNAL_SERVER_ERROR) {
        res.status(500).send({ message: "internal server error" });
        return;
    }

    if (fetchBalanceResult.status === fetchBalanceStatus.ACCOUNT_DOES_NOT_EXIST) {
        res.status(400).send({ message: "account does not exist" });
        return;
    }

    res.status(200).send({ balance: fetchBalanceResult.balance });
});

const fetchSrcAccountBalanceStatus = {
    SUCCESS: 0,
    INTERNAL_SERVER_ERROR: 1,
    ACCOUNT_DOES_NOT_EXIST: 2
};

const fetchSrcAccountBalance = async (srcAccountId) => {
    const text = "SELECT balance FROM Accounts WHERE account_id = $1";
    const values = [srcAccountId];
    console.log("text:", text);
    console.log("values:", values);

    try {
        const response = await client.query(text, values);
        const rows = response.rows;
        if (rows.length === 0) {
            return {
                status: fetchSrcAccountBalanceStatus.ACCOUNT_DOES_NOT_EXIST,
                balance: 0 
            };
        }

        return {
            status: fetchSrcAccountBalanceStatus.SUCCESS,
            balance: rows[0].balance
        };
    } catch (error) {
        console.error(error);
        return {
            status: fetchSrcAccountBalanceStatus.INTERNAL_SERVER_ERROR,
            balance: 0
        };
    }
};

const fetchDstAccountBalanceStatus = {
    SUCCESS: 0,
    INTERNAL_SERVER_ERROR: 1,
    ACCOUNT_DOES_NOT_EXIST: 2
};

const fetchDstAccountBalance = async (dstAccountId) => {
    const text = "SELECT balance FROM Accounts WHERE account_id = $1";
    const values = [dstAccountId];
    console.log("text:", text);
    console.log("values:", values);

    try {
        const response = await client.query(text, values);
        const rows = response.rows;
        if (rows.length === 0) {
            return {
                status: fetchDstAccountBalanceStatus.ACCOUNT_DOES_NOT_EXIST,
                balance: 0
            };
        }

        return {
            status: fetchDstAccountBalanceStatus.SUCCESS,
            balance: rows[0].balance
        };
    } catch (error) {
        console.error(error);
        return {
            status: fetchDstAccountBalanceStatus.INTERNAL_SERVER_ERROR,
            balance: 0
        };
    }
};

const updateAccountBalancesStatus = {
    SUCCESS: 0,
    INTERNAL_SERVER_ERROR: 1
};

const updateAccountBalances = async (srcAccountId, dstAccountId, srcAccountBalance, dstAccountBalance, amount) => {
    const query = `
        UPDATE Accounts SET balance = ${srcAccountBalance} - ${amount} WHERE account_id = '${srcAccountId}';
        UPDATE Accounts SET balance = ${dstAccountBalance} + ${amount} WHERE account_id = '${dstAccountId}';
    `;

    console.log("query:");
    console.log(query);

    try {
        await client.query(query);
        return {
            status: updateAccountBalancesStatus.SUCCESS
        };
    } catch (error) {
        console.error(error);
        return {
            status: updateAccountBalancesStatus.INTERNAL_SERVER_ERROR
        };
    }
};

// curl -X POST "http://localhost:5000/transfer?src_account_id=alice&dst_account_id=bob&amount=2000"
app.post("/transfer", async (req, res) => {
    console.log("request:", "/transfer");

    const srcAccountId = req.query.src_account_id;
    const dstAccountId = req.query.dst_account_id;

    if (srcAccountId === undefined) {
        res.status(400).send({ message: "missing source account" });
        return;
    }

    if (dstAccountId === undefined) {
        res.status(400).send({ message: "missing destination account" });
        return;
    }

    const sessiodId = req.cookies.session_id;
    const recordedSessionId = sessionIds.get(srcAccountId);
    if (sessiodId === undefined || recordedSessionId === undefined) {
        res.status(401).send({ message: "not logged in" });
        return;
    }

    if (sessiodId !== recordedSessionId) {
        res.status(401).send({ message: "wrong session ID" });
        return;
    }

    const fetchSrcAccountBalanceResult = await fetchSrcAccountBalance(srcAccountId);
    if (fetchSrcAccountBalanceResult.status === fetchSrcAccountBalanceStatus.INTERNAL_SERVER_ERROR) {
        res.status(500).send({ message: "internal server error" });
        return;
    }

    if (fetchSrcAccountBalanceResult.status === fetchSrcAccountBalanceStatus.ACCOUNT_DOES_NOT_EXIST){
        res.status(400).send({ message: "source account does not exist" });
        return;
    }

    console.log("source account balance:", fetchSrcAccountBalanceResult.balance);

    const fetchDstAccountBalanceResult = await fetchDstAccountBalance(dstAccountId);
    if (fetchDstAccountBalanceResult.status === fetchDstAccountBalanceStatus.INTERNAL_SERVER_ERROR) {
        res.status(500).send({ message: "internal server error" });
        return;
    }

    if (fetchDstAccountBalanceResult.status === fetchDstAccountBalanceStatus.ACCOUNT_DOES_NOT_EXIST) {
        res.status(400).send({ message: "destination account does not exist" });
        return;
    }

    console.log("destination account balance:", fetchDstAccountBalanceResult.balance);

    if (req.query.amount === undefined) {
        res.status(400).send({ message: "missing amount" });
        return;
    }

    const amount = Number(req.query.amount);
    if (!Number.isInteger(amount) || amount <= 0) {
        res.status(400).send({ message: "amount should be a positive integer" });
        return;
    }

    console.log("amount:", amount);
    if (amount > fetchSrcAccountBalanceResult.balance) {
        res.status(400).send({ message: "amount should not exceed balance" });
        return;
    }

    const updateAccountBalancesResult = await updateAccountBalances(
        srcAccountId,
        dstAccountId,
        fetchSrcAccountBalanceResult.balance,
        fetchDstAccountBalanceResult.balance,
        amount
    );

    if (updateAccountBalancesResult.status === updateAccountBalancesStatus.INTERNAL_SERVER_ERROR) {
        res.status(500).send({ message: "internal server error" });
        return;
    }

    res.status(200).send({});
});

const port = 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

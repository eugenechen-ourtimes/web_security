
DROP TABLE Accounts;

CREATE TABLE Accounts(
	account_id VarChar(16) Primary Key,
	username VarChar(32),
	password VarChar(16),
	balance BigInt,
	mobile_number VarChar(16)
);

BEGIN;

INSERT INTO Accounts(account_id, username, password, balance, mobile_number)
VALUES('alice', 'alice', '123', 10000, '0800000001');

INSERT INTO Accounts(account_id, username, password, balance, mobile_number)
VALUES('bob', 'bob', '123', 20000, '0800000002');

INSERT INTO Accounts(account_id, username, password, balance, mobile_number)
VALUES('mallory', 'mallory', '123', 0, '0800000003');

COMMIT;

SELECT * FROM Accounts;

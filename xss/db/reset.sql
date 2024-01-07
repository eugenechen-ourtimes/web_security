
DROP TABLE Comments;

CREATE TABLE Comments(
	content VarChar(256)
);

BEGIN;

INSERT INTO Comments(content)
VALUES('comment 1');

INSERT INTO Comments(content)
VALUES('comment 2');

INSERT INTO Comments(content)
VALUES('comment 3');

INSERT INTO Comments(content)
VALUES('comment 4');

INSERT INTO Comments(content)
VALUES('comment 5');

COMMIT;

SELECT * FROM Comments;

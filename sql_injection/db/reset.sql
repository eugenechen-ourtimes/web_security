
DROP TABLE UserProfiles;

CREATE TABLE UserProfiles(
	id Int Primary Key,
	username VarChar(32),
	password VarChar(8),
	job_title VarChar(48),
	mobile_number VarChar(16)
);

BEGIN;

INSERT INTO UserProfiles(id, username, password, job_title, mobile_number)
VALUES(1, 'alice', '123', 'Administrative Assistant', '0800000001');

INSERT INTO UserProfiles(id, username, password, job_title, mobile_number)
VALUES(2, 'bob', '123', 'Executive Assistant', '0800000002');

INSERT INTO UserProfiles(id, username, password, job_title, mobile_number)
VALUES(3, 'irene', '123', 'Marketing Manager', '0800000003');

INSERT INTO UserProfiles(id, username, password, job_title, mobile_number)
VALUES(4, 'tina', '123', 'Customer Service Representative', '0800000004');

INSERT INTO UserProfiles(id, username, password, job_title, mobile_number)
VALUES(5, 'joey', '123', 'Nurse Practitioner', '0800000005');

COMMIT;

SELECT * FROM UserProfiles;

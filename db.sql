CREATE TABLE users (
userId SERIAL PRIMARY KEY,
name varchar(40)
);

CREATE TABLE majors (
majorId SERIAL PRIMARY KEY,
name varchar(30)
);

CREATE TABLE classes (
classId SERIAL PRIMARY KEY,
host int references users(userId),
major int references majors(majorId)
);

CREATE TABLE topics (
topicId SERIAL PRIMARY KEY,
host int references users(userId),
class int references classes(classId),
xml text
);

CREATE TABLE comments (
commentId SERIAL PRIMARY KEY,
host int references users(userId),
topic int references topics(topicId),
commentBody text
);
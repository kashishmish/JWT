create database jwtlogin;

create table users(
    user_id uuid primary key default uuid_generate_v4(),
    user_name varchar(255) not null,
    user_email varchar(255) not null,
    user_password varchar(255) not null
);

insert into users(user_name,user_email,user_password) values ('kashish mishra','kashish@gmail.com','1234');-- ""yeh vale quotes kaam nhi krenge'' sirf yhi krenge
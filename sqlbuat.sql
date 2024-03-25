-- Active: 1710511749892@@127.0.0.1@5432@movies
CREATE DATABASE movies;

CREATE Table movies (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255),
    director VARCHAR(255),
    release_year INT,
    is_available BOOLEAN default true
)
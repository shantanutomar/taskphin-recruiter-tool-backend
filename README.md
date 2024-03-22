# Taskphin recruiter tool - Backend

This is the backend of the Taskphin recruiter tool. It is a RESTful API that provides the following functionalities:
- Create a new candidate
- Update a candidate
- Delete a candidate
- Get a candidate by ID
- Get all candidates

## Description

- The backend is built using Express.js framework of NodeJS along with Typescript. 
- It uses [Render](https://render.com/) as Managed PostgreSQL as the database. 
- The backend app is hosted on Digital Ocean.
- Sequelize ORM is used to interact with the database.

## Getting Started

### Dependencies

* Install node version 20.

### Running in local

* Clone the [repository](https://github.com/shantanutomar/taskphin-recruiter-tool-backend.git)
* Install the dependencies using `npm install`
* Create a `.env` file in the root directory and add the following environment variables
```
PORT=5001
DATABASE_URL=postgres://recruitmentdb_bf0p_user:v0kJDHvBEL5E4z8yPiFbIHZxRj6RlHZA@dpg-cnren2mn7f5s738c0iu0-a.oregon-postgres.render.com/recruitmentdb_bf0p?ssl=true
```
* The database is up and running on Render. The above DATABASE_URL is the connection string to the database.
* Build the app using `npm run build`
* Run the app using `npm run start`
* The app will be running on `http://localhost:5001`

## Authors

Shantanu Tomar
[@shantanutomar](https://www.linkedin.com/in/shantanu-tomar/)
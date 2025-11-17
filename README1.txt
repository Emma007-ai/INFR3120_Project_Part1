README

Project Title: RecipeCraft

Description:
RecipeCraft is a simple recipe management web application that allows users to add, edit, delete, view, and search for recipes. Each recipe includes fields such as name, ingredients, steps, duration, equipment, notes, and an image. The project uses Node.js, Express, EJS templates, and MongoDB Atlas as the cloud database.

Features:

Add new recipes

Edit existing recipes

Delete recipes

View recipes in a read-only page

Search recipes by name, ingredients, and notes

Upload images from the user’s computer

About and Contact pages

Cloud database storage using MongoDB Atlas

Technologies Used:
Node.js
Express.js
MongoDB Atlas
Mongoose
EJS
HTML and CSS
Bootstrap
Git and GitHub
Render (deployment)

File Structure:
app.js – main server file
routes/index.js – routing logic
models/Recipe.js – database schema
views/ – EJS templates
views/partials/ – header and footer
public/stylesheets/style.css – styling
public/javascripts/main.js – client scripts
public/images – images
.env – contains MongoDB connection string
.gitignore – hides sensitive files

Environment Variables:
The project uses a .env file that stores the MongoDB Atlas connection string.
This file must not be uploaded to GitHub.

How to Run:

Install Node.js

Run "npm install" to install dependencies

Create a .env file in the project root and add the MongoDB connection string

Start the server with "npm start"

Open the browser at "http://localhost:3000
"

Deployment:
The project is deployed using Render. The environment variable MONGO_URI must be added to Render for the database to connect. The build command is "npm install" and the start command is "npm start".

Purpose:
This project was built for academic purposes as part of the INFR3120 course to demonstrate full-stack development with a cloud-based database.
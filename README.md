Trade Trends was developed by Symeon Soldatos & Dimitrios Polychronos.

Project structure:
•	Inside the "public" folder, there is a file with the CSS for the application, the main part of the application, which is the client-side code, and a subfolder containing all the photos and icons we used.

•	The "models" folder contains the JavaScript files which define the database schemas we used for the application.

•	Inside the "views" folder, all our .ejs files are located.

•	The "server.js" file contains the code for the functionality of the server.

•	Inside the "controllers" folder, there is the "authController.js" file, which contains the routes for sign up and login.

•	The "routes" folder contains the "authRoutes.js" file, which is a router for signup and login. Additionally, it contains the "verifyToken.js", which is a middleware to check if the user is authenticated and grant access.

•	The "validation.js" file uses Joi to validate that the data format is correct when the user logs in and registers.


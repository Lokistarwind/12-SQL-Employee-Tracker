# 12-SQL-Employee-Tracker

## Description
The purpose of this project is to build an Employeee Tracker application. It was made to create and maintain a locally run database of employees. Making the code for it help me understand the concept of using MYSQL and using chains of queries to get and manipulate data for use.

## Installation
Once you downloaded the file, open the terminal and cd into the correct directory.
In terminal enter 
npm init -y

Afterwards install inquirer by typing this into the terminal
npm i inquirer@8.2.4
You will also need to install dotenv, express, and mysql2 so do so by entering
npm i
npm i mysql2

Once all the dependencies are installed type mysql -u root -p
It will ask you to login. Once you do you type
SOURCE db/schema.sql;
rhis will load up the tables;
Next to better see functionality, you can load up data by typing
SOURCE db/seeds.sql;

Afterwards before starting, you need to create a .env file and enter data into the file to use in this format:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOURPASSWORD
DATABASE=company_db

Now you can run the project by typing
node index
Doing so will start the application.


For a detailed look see this video demonstration.
https://youtu.be/om8dGVHC_ZY


## Usage
You can use the project to see how inquerier runs and see how mysql is used to create and manipulate data. Also its a handy tool to create a usable app to track information.


## Credits
For this project I used code from Challange 10 to make a rough outline and structure of the project. Also I used some snippets from these two places to figure out some handy methods to write up some of the MYSQL queries.
https://stackoverflow.com/questions/22739841/mysql-combine-two-columns-into-one-column
https://stackoverflow.com/questions/17434929/joining-two-tables-with-specific-columns

# VibeNest

*VibeNest* is a platform where users can discover, share, and manage events. This project uses *Ballerina* for backend services and *MySQL* as the database.

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. [Ballerina](https://ballerina.io/downloads/)
2. [MySQL](https://dev.mysql.com/downloads/)

## Project Setup

Follow the steps below to set up the project on your local machine.

### 1. Install Ballerina

Download and install *Ballerina* from the [official website](https://ballerina.io/downloads/). Follow the instructions for your operating system.

Once installed, verify the installation by running the following command in your terminal:
```bash
ballerina -v
```


### 2. Install MySQL

Download and install *MySQL* from the [official website](https://dev.mysql.com/downloads/).

Once installed, start MySQL and log in using the following command:
```bash
mysql -u root -p
```

### 3. Set Up the Database

After logging into MySQL, create a new database named baltest by executing the following SQL command:
```sql
CREATE DATABASE baltest;
```

Switch to the baltest database:
```sql
USE baltest;
```

Now, create the necessary tables for the project.

### 4. Create Tables

#### Create posts Table
Execute the following SQL command to create the posts table:
```sql
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300),
    description VARCHAR(1000),
    user_id INT,
    image_path LONGTEXT,
    category VARCHAR(10),
    contact VARCHAR(12)
);
```

#### Create users Table
Execute the following SQL command to create the users table:
```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    birth_date VARCHAR(10),
    contact VARCHAR(12),
    password VARCHAR(20)
);
```

### 5. Configure the Project

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Eshhar121/iwb361-cen.git
   ```

2. Open the project folder:
   ```bash
   cd vibenest
   ```

3. Set up your *Ballerina* project by running:
   ```bash
   ballerina init
   ```

4. Configure the *Ballerina* project to connect to your MySQL database by updating the database connection settings in the Config.toml file:
   ```toml
   [database]
   url = "jdbc:mysql://localhost:3306/baltest"
   username = "root"
   password = "yourpassword"
   ```

### 6. Run the Project

To run the project, use the following command:
```bash
ballerina run
```

### 7. Access the Application

Once the application is running, open your browser and navigate to:

```http://localhost:9090```


You should now be able to access *VibeNest* and start using the application.

import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}

service /api on new http:Listener(9090) {
    private final mysql:Client db;

    function init() returns error? {
        // Initiate the mysql client at the start of the service. This will be used
        // throughout the lifetime of the service.
        self.db = check new ("localhost", "root", "1234", "baltest", 3306);
    }

    //Get All Posts
    resource function get Posts() returns Post[]|error {
        // Execute simple query to retrieve all records from the `albums` table.
        stream<Post, sql:Error?> postStream = self.db->query(`SELECT * FROM Posts`);

        // Process the stream and convert results to Album[] or return error.
        return from Post post in postStream
            select post;
    }

    //Get Posts by Catergory

    resource function get Posts/[string category]() returns Post[]|error {
        sql:ParameterizedQuery query = category is string ?
            `SELECT * FROM POSTS WHERE CATEGORY = ${category}` : `SELECT * FROM POSTS`;
        stream<Post, sql:Error?> postStream = self.db->query(query);
        return from Post post in postStream
            select post;
    }

    //Get All Users
    resource function get Users() returns User[]|error {
        // Execute simple query to retrieve all records from the `albums` table.
        stream<User, sql:Error?> userStream = self.db->query(`SELECT * FROM users`);

        // Process the stream and convert results to Album[] or return error.
        return from User user in userStream
            select user;
    }

    // Register 
     resource function post RegisterUser(User user) returns http:Response|error {

    // SQL query to insert a new user
    sql:ParameterizedQuery query = `INSERT INTO users (first_name, last_name, birth_date, email, contact, password)
                                     VALUES (${user.first_name},${user.last_name},${user.birth_date},${user.email},${user.contact},${user.password})`;

    // Execute the query to insert the user
    sql:ExecutionResult result = check self.db->execute(query);

    // Create a response object
    http:Response res = new;
    res.statusCode = 201; // HTTP 201 Created
    res.setPayload({message: "User registered successfully"});

    return res;
}

    //Login

    resource function post Login(LoginUser user) returns http:Response|error {

        // Check if username exists
        sql:ParameterizedQuery usernameQuery = `SELECT 1 FROM users WHERE email = ${user.email}`;
        sql:ParameterizedQuery userpasswordQuery = `SELECT 1 FROM users WHERE password = ${user.password}`;
        sql:ExecutionResult usernameResult = check self.db->queryRow(usernameQuery);
        sql:ExecutionResult userpasswordResult = check self.db->queryRow(userpasswordQuery);

        if (usernameResult.length() == 0 && userpasswordResult.length() == 0) {
            return error("Invalid username");
        }

        else {
            http:Response res = new;
            res.statusCode = 200; // HTTP 200 OK
            res.setPayload({message: "Login successful"});
            return res;
        }

    }

    //get Posts belong to User

    resource function get UserPosts/[int user_id]() returns Post[]|error {
        sql:ParameterizedQuery query = `SELECT * FROM POSTS WHERE USER_ID = ${user_id}`;
        stream<Post, sql:Error?> postStream = self.db->query(query);
        return from Post post in postStream
            select post;

    }

    //Post a new Post

    resource function post NewPost(Post post) returns http:Response|error {
        sql:ParameterizedQuery query = `INSERT INTO posts (title, description, user_id, image_path, category, contact)
                                     VALUES (${post.title},${post.description},${post.user_id},${post.image_path},${post.category},${post.contact})`;
        sql:ExecutionResult result = check self.db->execute(query);
        http:Response res = new;
        res.statusCode = 201; // HTTP 201 Created
        res.setPayload({message: "Post created successfully"});
        return res;

    }

    // Get the UserId based on username

    resource function get UserId/[string email]() returns anydata[]|error {
        // Prepare the SQL query to fetch the user ID based on the username
        sql:ParameterizedQuery query = `SELECT  user_id FROM users WHERE email = ${email}`;

        // Execute the query and retrieve the result
        sql:ExecutionResult result = check self.db->queryRow(query);

        // Extract the user ID from the result
        return result.toArray().last();

    }

    //get the Postids belong to user
     resource function get PostIds/[int userId]() returns anydata[]|error {
    // Prepare the SQL query to fetch all post IDs for the given user ID
    sql:ParameterizedQuery query = `SELECT post_id FROM posts WHERE user_id = ${userId}`;
    
    // Execute the query and retrieve the result
    sql:ExecutionResult result = check self.db->queryRow(query);

    // Check if the result has any rows
    if result is sql:ExecutionResult {
        // Convert the result to an array of post IDs
        anydata[] postIds = result.toArray();
        
        // Return the array of post IDs
        return postIds;
    } else {
        
    }
}


    //Get Post By ID 
    resource function get posts/[int id]() returns Post|http:NotFound {
        Post|error post = self.db->queryRow(`SELECT * FROM POSTS WHERE post_id = ${id}`);
        return post is Post ? post : http:NOT_FOUND;
    }

    //Check Post Id and User Id match

    resource function get Veify/[int post_id]/[int user_id]() returns http:Response|error {

        sql:ParameterizedQuery query = `SELECT user_id FROM posts WHERE post_id = ${post_id}`;

        sql:ExecutionResult result = check self.db->queryRow(query);

        anydata userID = result.toArray()[2];
        userID = userID.toString();

        anydata user_String_id = user_id.toString();

        if (userID == user_String_id) {
            http:Response res = new;
            res.statusCode = 200; // HTTP 201 Created
            res.setPayload({message: "Okay"});
            return res;
        }
        else {
            http:Response res = new;
            res.statusCode = 400; // HTTP 201 Created
            res.setPayload({message: "Okay"});
            return res;
        }

    }

    //Delete Post

    resource function get DeletePost/[int post_id]() returns http:NoContent|error {

        sql:ParameterizedQuery query = `DELETE FROM posts WHERE post_id = ${post_id}`;

        sql:ExecutionResult result = check self.db->execute(query);

        return http:NO_CONTENT;
    }

    //UpDate Posts

    resource function post UpDate/[int post_id](Post post) returns http:Response|error {

        // Parameterized query with placeholders to prevent SQL injection
        sql:ParameterizedQuery query = `UPDATE posts 
                                    SET title = ${post.title}, 
                                        description = ${post.description}, 
                                        image_path = ${post.image_path}, 
                                        contact = ${post.contact}, 
                                        category = ${post.category} 
                                    WHERE post_id = ${post_id}`;

        // Execute the query and handle errors
        sql:ExecutionResult result = check self.db->execute(query);

        // Prepare the response
        http:Response res = new;
        res.statusCode = 201; // HTTP 201 Created
        res.setPayload({message: "Post created successfully"});
        return res;

    }
}


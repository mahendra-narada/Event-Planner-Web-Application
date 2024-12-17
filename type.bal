import ballerina/sql;
import ballerina/http;

type Post record {

    @sql:Column {
        name: "title"
    }
    string title;

    @sql:Column {
        name: "description"
    }
    string description;

    @sql:Column {
        name: "user_id"
    }
    int user_id;

    @sql:Column {
        name: "image_path"
    }
    string image_path;

    @sql:Column {
        name: "category"
    }
    string category;

    @sql:Column {
        name: "contact"
    }
    string contact;
    
};

type User record {
 
   @sql:Column {
        name: "first_name"
    }
    string first_name;

   @sql:Column {
        name: "last_name"
    }
    string last_name;

   @sql:Column {
        name: "birth_date"
    }
    string birth_date;

    @sql:Column {
        name: "email"
    }
    string email;

   @sql:Column {
        name: "contact"
    }
    string contact;

    @sql:Column {
        name: "password"
    }
    string password;
};


type LoginUser record {
    string email;
    string password;
};


type UserRegistered record {
    *http:Created;
    User body;
};
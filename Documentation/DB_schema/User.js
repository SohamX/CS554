const user = {
    "_id": new ObjectId(),
    "name": String,
    "email": String,
    "password": String,   // hashed password
    "profileImage": String,   // URL to the image stored (Optional?)
    "location": {
        "address": String,
        "city": String,
        "state": String,
        "zipcode": String,
        "country": String,
        "coordinates": { "longitude": longitude, "latitude": latitude } //Calculated and stored?
    },
            // Registration timestamp
    "cookDetails": {          // If user is a cook
        "bio": String,
        "rating": Number,         // Average rating?
        "reviews":[reviewers], 
        "dishes": [ObjectId("DishId")],  // Array of dish IDs posted by the cook
         // Total earnings from selling meals
    },
    "studentDetails": {       // If user is a student
        "favorites": [ObjectId("DishId")],   // Array of favorite dish IDs
        "mealRequests": [ObjectId("MealRequestId")]  // Array of posted meal requests
    }
}

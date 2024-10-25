const user = {
    "_id": new ObjectId(),
    "name": String,
    "email": String,
    "password": String,   // hashed password
    "role": "cook" | "student",
    "profileImage": String,   // URL to the image stored (Optional?)
    "location": {
        "address": String,
        "city": String,
        "state": String,
        "zipcode": String,
        "country": String,
        "coordinates": { "longitude": longitude, "latitude": latitude } //Calculated and stored?
    },
    "joinedAt": Date,         // Registration timestamp
    "cookDetails": {          // If user is a cook
        "bio": String,
        "rating": Number,         // Average rating?
        "specialties": [String],   // List of cuisine types or specialties (e.g., Italian, Vegan)
        "dishes": [ObjectId("DishId")],  // Array of dish IDs posted by the cook
        "availability": {
            "days": [String],  // E.g., ['Monday', 'Wednesday', 'Friday']
            "hours": { "start": String, "end": String }  // E.g., {"start": "10:00", "end": "20:00"}
        },
        "earnings": Number,  // Total earnings from selling meals
    },
    "studentDetails": {       // If user is a student
        "favorites": [ObjectId("DishId")],   // Array of favorite dish IDs
        "mealRequests": [ObjectId("MealRequestId")]  // Array of posted meal requests
    }
}

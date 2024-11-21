const user = {
    "_id": new ObjectId(),
    "name": String,
    "email": String,
    "password": String,   // hashed password
    "role": "cook" | "student",
    "profileImage": String,   // URL to the image stored (Optional?)
    "location": {
        "streetAddress": String,
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
        "reviews": [reviewers],
        "dishes": [ObjectId("DishId")],  // Array of dish IDs posted by the cook
        // "availability": {
        //     "days": [String],  // E.g., ['Monday', 'Wednesday', 'Friday']
        //     "hours": { "start": String, "end": String }  // E.g., {"start": "10:00", "end": "20:00"}
        // },
        // "earnings": Number,  // Total earnings from selling meals
    },
    "studentDetails": {       // If user is a student
        "favorites": [ObjectId("DishId")],   // Array of favorite dish IDs
        "mealRequests": [ObjectId("MealRequestId")]  // Array of posted meal requests
    },
    "cart": [{
        "_id": new ObjectId(),
        "cookId": ObjectId("UserId"),      // References the cook who is fulfilling the order
        "dishes": [{
            "dishId": ObjectId("DishId"),
            "quantity": Number
        }],      // References the dish added to cart along with tgheir quantities       
        "totalCost": Number,              // Total price = quantity * dish price        
    }],
    "paymentMethod": [{
        "_id": new ObjectId(),
        "type": "creditCard" | "debitCard" | "PayPal" | "Stripe",
        "provider": "visa" | "masterCard" | "americanExpress" | "discover" | "PayPal" | "Stripe",
        "cardNumber": String,   // hashed cardNumber
        "last4Digits": String, //last four digits on the card
        "expirationDate": "MM/YY",
        "createdAt": Date,
        "isDefault": Boolean,
        "billingAddress": {
            "zipCode": String,
            "country": String
        },
        "nickName": String
    }]
}

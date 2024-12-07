const user = {
    "_id": new ObjectId(),
    "firstName": String,
    "lastName": String,
    "username": String,
    "password": String,   // hashed password
    "role": "user",
    "gmail": String,
    "mobileNumber": String,
    "location": {
        "streetAddress": String,
        "city": String,
        "state": String,
        "zipcode": String,
        "country": String,
        "coordinates": { "longitude": longitude, "latitude": latitude } //Calculated and stored?
    },
    
           
    "favorites": [ObjectId("DishId")],   
    "mealRequests": [ObjectId("MealRequestId")]  ,
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


const cook = {
    "_id": new ObjectId(),
    "firstName": String,
    "lastName": String,
    "username": String,
    "password": String,
    "role": "cook",
    "gmail": String,
    "mobileNumber": String,
    "bio": String,
    "location": {
        "address": String,
        "city": String,
        "state": String,
        "zipcode": String,
        "country": String,
        "coordinates": { "longitude": "", "latitude": "" } //Calculated and stored?
    },
    "availability": {
        "days": [],  // E.g., ['Monday', 'Wednesday', 'Friday']
        "hours": { "start": "", "end": "" }  // E.g., {"start": "10:00", "end": "20:00"}
    },
    "earnings": Number,
    "dishes": [ObjectId("DishId")],
    "avgRating": Number,
    "reviews" : [{
        "userId": ObjectId("userId"), // Array of reviewers
        
        "review": String,
         "rating": Number      // Rating for 5
    }]
    

}
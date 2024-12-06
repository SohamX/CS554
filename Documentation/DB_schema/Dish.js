const dish = {
    "_id": new ObjectId(),
    "cookId": ObjectId("UserId"),  // References the cook who posted the dish
    "name": String,
    "description": String,
    "cuisineType": String,         // E.g., 'Italian', 'Chinese', 'Indian'
    "cost": Number,               // Price of the dish    
    // "availability": {
    //     "date": Date,                // Date the dish is available
    //     "time": { "start": String, "end": String }  // availability window        
    // },
    "images": [String],               // URL to the dish image stored
    "rating": Number,              // Average rating of the dish
    "createdAt": Date,             // Timestamp when dish was created in the DB
    "isAvailable": Boolean//,         // Whether the dish is currently available
    //"isDeleted": Boolean    //true, if dish is deleted by the cook
}

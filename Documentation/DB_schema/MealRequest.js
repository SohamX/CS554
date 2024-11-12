const mealReq = //Bulk order
{
    "_id": new ObjectId(),
    "studentId": ObjectId("UserId"),  // References the student making the request
    "noOfPeople": Number,       //Minimum 5
    "description": String,            // Description of the requested meal
    "cuisineType": String,            // Optional cuisine type (e.g., 'Vegan', 'Gluten-Free')
    "budget": Number,                 // Budget for the meal request
    "requiredBy": Date, // Timestamp till when the meal is needed. Meal requested will be displayed before this time only.  
    //Should place a request prior to min 24 hours  and max 10 days
    "status": "open" | "confirmed" | "in-progress" | "ready" | "completed" | "cancelled" | "expired",  // Request status
    "createdAt": Date,                // Timestamp when the request was made
    "responses": [
        {
            "cookId": ObjectId("UserId"),
            "message": String,             // Cook's response message
            "priceOffer": Number,          // Price offer by the cook
            "responseDate": Date,           // Timestamp when the response was made
            "selectedByUser": Boolean       // Whether user select this option or not
        }
    ]
}


//Student (customizable) -> Chef
//Once meal req is moved to confirmed, if we add it as an order in the Order schema
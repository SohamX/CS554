const order = {
    "_id": new ObjectId(),
    "dishes": [{
        "dishId": ObjectId("DishId"),
        "quantity": Number
    }],      // References the dish ordered
    "studentId": ObjectId("UserId"),   // References the student who ordered
    "cookId": ObjectId("UserId"),      // References the cook who is fulfilling the order
    "status": "placed" | "pending" | "declined" | "confirmed" | "in-progress" | "ready" | "completed" | "cancelled",  // Order status
    //student can cancel order before it is confirmed by chef
    //"quantity": Number,                // Number of portions ordered
    "isMealReq": Boolean,
    "totalCost": Number,              // Total price = quantity * dish price
    "paymentMethod": "PayPal" | "Stripe",  // Payment method
    // "delivery": {
    //     "method": "pickup" | "delivery",
    //     "deliveryAddress": String,      // Address in case of delivery
    //     "expectedTime": Date            // Expected time of delivery or pickup
    // },
    "createdAt": Date,                // Timestamp when the order was placed
    "updatedAt": Date,                 // Timestamp for last update on order status
    "rating": Number, //0-5 (Optional) Student can rate the order only if it is completed?
    "review": String,    //(Optional) Student can leave a review after the order is completed?
    "invoiceLink": "S3 url"
}


//Student (existing dishes) -> Chef
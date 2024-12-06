import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {userData} from './data/index.js';
import { mealReqData } from './data/index.js';
const db = await dbConnection();
await db.dropDatabase();

let userIds = [];
const usersData = [
    {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      password: "JohnDoe123@",
      gmail: "john.doe@gmail.com",
      mobileNumber: "123-456-7890",
      address: "1234 Elm St",
      city: "New York",
      state: "NY",
      zipcode: "10001",
      country: "USA"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      password: "JaneSmith456@",
      gmail: "jane.smith@gmail.com",
      mobileNumber: "098-765-4321",
      address: "5678 Oak St",
      city: "Los Angeles",
      state: "CA",
      zipcode: "90001",
      country: "USA"
    },
    {
        firstName: "Alice",
        lastName: "Johnson",
        username: "alice",
        password: "Alice123!",
        gmail: "alice.johnson@gmail.com",
        mobileNumber: "123-456-7880",
        address: "123 Maple St",
        city: "Springfield",
        state: "IL",
        zipcode: "62704",
        country: "USA",
      },
      {
        firstName: "Bob",
        lastName: "Brown",
        username: "bobby",
        password: "Bobby456@",
        gmail: "bob.brown@gmail.com",
        mobileNumber: "987-654-3210",
        address: "456 Oak St",
        city: "Dallas",
        state: "TX",
        zipcode: "75201",
        country: "USA",
      }
    // Add more users as needed
  ];

  const cooksData = [
    {
      firstName: "Charlie",
      lastName: "Cook",
      username: "charli",
      password: "CharlieCook1@",
      gmail: "charlie.cook@gmail.com",
      mobileNumber: "111-222-3333",
      address: "789 Pine St",
      city: "Seattle",
      state: "WA",
      zipcode: "98101",
      country: "USA",
      bio: "I am a professional chef",
    },
    {
      firstName: "Diana",
      lastName: "Baker",
      username: "dianabake",
      password: "DianaBake2@",
      gmail: "diana.bake@gmail.com",
      mobileNumber: "222-333-4444",
      address: "321 Birch St",
      city: "Chicago",
      state: "IL",
      zipcode: "60601",
      country: "USA",
      bio: "I am a professional chef",
    },
    {
      firstName: "Evan",
      lastName: "Grillmaster",
      username: "evangrill",
      password: "EvanGrill3@",
      gmail: "evan.grill@gmail.com",
      mobileNumber: "333-444-5555",
      address: "456 Cedar St",
      city: "Austin",
      state: "TX",
      zipcode: "73301",
      country: "USA",
      bio: "I am a professional chef",
    },
    {
      firstName: "Fiona",
      lastName: "Soup",
      username: "fionasoup",
      password: "FionaSoup4@",
      gmail: "fiona.soup@gmail.com",
      mobileNumber: "444-555-6666",
      address: "123 Spruce St",
      city: "Portland",
      state: "OR",
      zipcode: "97201",
      country: "USA",
      bio: "I am a professional chef",
    },
  ];

  
  for (const cook of cooksData) {
    try {
      await userData.registerCook(
        cook.firstName,
        cook.lastName,
        cook.username,
        cook.password,
        cook.gmail,
        cook.mobileNumber,
        cook.address,
        cook.city,
        cook.state,
        cook.zipcode,
        cook.country,
        cook.bio
      );
      console.log(`Cook ${cook.username} registered successfully`);
    } catch (error) {
      console.error(`Failed to register ${cook.username}: ${error}`);
    }
  }

  for (const user of usersData) {
    try {
     const { signupCompleted, user: registeredUser } = await userData.registerUser(
        user.firstName,
        user.lastName,
        user.username,
        user.password,
        user.gmail,
        user.mobileNumber,
        user.address,
        user.city,
        user.state,
        user.zipcode,
        user.country
      );
      if (signupCompleted) {
        console.log(`User ${registeredUser.username} registered successfully with ID: ${registeredUser._id}`);
        userIds.push(registeredUser._id.toString()); // Store the user ID
      }
    } catch (error) {
      console.error(`Failed to register ${user.username}: ${error}`);
    }
  }

  const mealData = [
    {
      userId: userIds[0], // Replace with actual userId from your DB
      noOfPeople: 6,
      description: "A traditional Italian",
      cuisineType: "Italian",
      budget: 150,
      requiredBy: "12/13/2024",
    },
    {
      userId: userIds[2], // Replace with actual userId from your DB
      noOfPeople: 10,
      description: "A traditional Indian",
      cuisineType: "Indian",
      budget: 200,
      requiredBy: "12/12/2024",
    },
    {
      userId: userIds[1], // Replace with actual userId from your DB
      noOfPeople: 8,
      description:"A traditional spanish",
      cuisineType: "BBQ",
      budget: 180,
      requiredBy: "12/11/2024",
    },
    {
      userId: userIds[1], // Replace with actual userId from your DB
      noOfPeople: 5,
      description: "Vegetarian-friendly",
      cuisineType: "Thai",
      budget: 120,
      requiredBy: "12/10/2024",
    },
  ];

  for (const meal of mealData) {
    try {
      const result = await mealReqData.createMealreq(
        meal.userId,
        meal.noOfPeople,
        meal.description,
        meal.cuisineType,
        meal.budget,
        meal.requiredBy
      );
      console.log(
        `Meal request for user ${meal.userId} created successfully: ${JSON.stringify(result)}`
      );
    } catch (error) {
      console.error(`Failed to create meal request for user ${meal.userId}: ${error}`);
    }
  }


console.log('Done seeding database');

await closeConnection();
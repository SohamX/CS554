import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {userData} from './data/index.js';
import { mealReqData } from './data/index.js';
import { dishData } from './data/index.js';
import { cookData } from './data/index.js';
const db = await dbConnection();
await db.dropDatabase();

const userIds = [];
const cookIds = [];

const userSeedData = [
  {
    firstName: "bunny",
    lastName: "nad",
    username: "bunny",
    gmail: "mohithsai@gmail.com",
    mobileNumber: "200-022-7890",
    address: "103 Zabriskie St",
    city: "Jersey",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    latitude: 40.7470202,
    longitude: -74.0543917,
  },
  {
    firstName: "SackShi",
    lastName: "Sher",
    username: "SackOne",
    gmail: "test122@gmail.com",
    mobileNumber: "122-111-9090",
    address: "Apt-5 13031 Nelson St",
    city: "Garden Grove",
    state: "California - CA",
    zipcode: "92843",
    country: "US",
    latitude: 33.7735611,
    longitude: -117.9456135,
  },
  {
    firstName: "Praneeth",
    lastName: "Nadella",
    username: "praneeth",
    gmail: "pnadella@stevens.edu",
    mobileNumber: "200-022-1234",
    address: "103 Zabriskie",
    city: "Jersey",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    latitude: 40.7470585,
    longitude: -74.0543481,
  },
  {
    firstName: "sakshi",
    lastName: "sherkar",
    username: "ssOneTwo",
    gmail: "sakshi4995@gmail.com",
    mobileNumber: "999-999-8888",
    address: "2058 US-130",
    city: "Garden Grove",
    state: "California - CA",
    zipcode: "92843",
    country: "US",
    latitude: 33.7675239,
    longitude: -117.9424743,
  },
  {
    firstName: "sakshi",
    lastName: "sherkar",
    username: "shersakshi",
    gmail: "sakshi4997@gmail.com",
    mobileNumber: "222-111-3333",
    address: "50 Central Ave",
    city: "Jersey City",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    latitude: 40.73222290604892,
    longitude: -74.06118792578637,
  },
  {
    firstName: "PraneethN",
    lastName: "Nadella",
    username: "pnadella",
    gmail: "nadellapraneeth26@gmail.com",
    mobileNumber: "200-022-0000",
    address: "103 Zabriskie",
    city: "Jersey",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    latitude: 40.7469616,
    longitude: -74.0544184,
  },
  {
    firstName: "Mohini",
    lastName: "Mayekar",
    username: "mayekar",
    gmail: "mmayekar@gmail.com",
    mobileNumber: "551-551-5512",
    address: "North Street",
    city: "Jersey City",
    state: "New Jersey - NJ",
    zipcode: "07306",
    country: "United States",
    latitude: 40.7390039,
    longitude: -74.0642968,
  },
  {
    firstName: "Soham",
    lastName: "Talekar",
    username: "Sohamx",
    gmail: "sohamtalekar7@gmail.com",
    mobileNumber: "201-848-2511",
    address: "96 Liberty Av",
    city: "Jersey City",
    state: "New Jersey - NJ",
    zipcode: "07303",
    country: "United States",
    latitude: 40.7390039,
    longitude: -74.0642968,
  },
];

for (const user of userSeedData) {
  try {
    const result = await userData.registerUser(
      user.firstName,
      user.lastName,
      user.username,
      user.gmail,
      user.mobileNumber,
      user.address,
      user.city,
      user.state,
      user.zipcode,
      user.country,
      user.latitude,
      user.longitude
    );
    console.log("User registered successfully:", result);
    userIds.push(result.user._id.toString());
  } catch (error) {
    console.error("Error registering user:", error);
  }
}


// CCOKS DATA 

export const cooksSeedData = [
  {
    firstName: "mohith",
    lastName: "sai",
    username: "mohith",
    gmail: "mohithpraneeth@gmail.com",
    mobileNumber: "200-022-1111",
    address: "103 Zabriskie",
    city: "Jersey",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    bio: "Im a proffessional cook believe me",
    latitude: 40.7470552,
    longitude: -74.0543581
  },
  {
    firstName: "Test",
    lastName: "One",
    username: "testOne",
    gmail: "testOne@gmail.com",
    mobileNumber: "333-999-2727",
    address: "439 Central Avenue",
    city: "Jersey City",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    bio: "Best chef in the home that I live alone in",
    latitude: 40.7322664,
    longitude: -74.059887
  },
  {
    firstName: "Sakshi",
    lastName: "Sherkar",
    username: "JohnDoeFiv",
    gmail: "sherkar.sakshi.15ce1040@gmail.com",
    mobileNumber: "505-505-0505",
    address: "Apt-5 13031 Nelson St",
    city: "Garden Grove",
    state: "California - CA",
    zipcode: "92843",
    country: "US",
    bio: "well I am a corporate worker, with cooking as a hobby and I make a delicious turkey!",
    latitude: 33.7735611,
    longitude: -117.9456135
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    username: "doejane",
    gmail: "sak@gmail.com",
    mobileNumber: "231-345-6789",
    address: "22 Col Ave",
    city: "New York City",
    state: "New York - NY",
    zipcode: "07302",
    country: "US",
    bio: "I am an English Chef, forte - english brreakfast",
    latitude: 40.732,
    longitude: -74.0603181
  },
  {
    firstName: "praneeth",
    lastName: "nad",
    username: "prannad",
    gmail: "praneeth26052000@gmail.com",
    mobileNumber: "200-022-0123",
    address: "103 Zabriskie",
    city: "Jersey",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "US",
    bio: "Im a proffessional cook believe me",
    latitude: 40.7470407,
    longitude: -74.0543678
  },
  {
    firstName: "Soham",
    lastName: "Talekar",
    username: "cooker",
    gmail: "soham.kavindra123go@gmail.com",
    mobileNumber: "986-704-2867",
    address: "622 Liberty Ave",
    city: "Jersey City",
    state: "New Jersey - NJ",
    zipcode: "07307",
    country: "United States",
    bio: "I am a president of USA",
    latitude: 40.7535307,
    longitude: -74.0417513
  }
];

for (const cook of cooksSeedData) {
  try {
    const result = await cookData.registerCook(
      cook.firstName,
      cook.lastName,
      cook.username,
      cook.gmail,
      cook.mobileNumber,
      cook.address,
      cook.city,
      cook.state,
      cook.zipcode,
      cook.country,
      cook.bio,
      cook.latitude,
      cook.longitude
    );
    console.log(`Cook ${cook.username} registered successfully!`);
    cookIds.push(result.cook._id.toString());
  } catch (error) {
    console.error(`Failed to register cook ${cook.username}:`, error.message);
  }
}

//DISH DATA  

const dishObjects = [
  {
    _id: "675d727bef78fbe6b37efd19",
    cookId: cookIds[4],
    name: "Chicken Biryani",
    description: "some",
    cuisineType: "INDIAN",
    cost: 20,
    rating: "-",
    createdAt: "Sat, 14 Dec 2024 11:56:43 GMT",
    isAvailable: true,
    imageName: "896b28242daa6a11e2068a79f05734c5a0c5b1305192738bbeeb6b19afe58637"
  },
  {
    _id: "675d72a4ef78fbe6b37efd1a",
    cookId: cookIds[4],
    name: "Aloo paratha",
    description: "soemee",
    cuisineType: "INDIAN",
    cost: 30,
    rating: "-",
    createdAt: "Sat, 14 Dec 2024 11:57:24 GMT",
    isAvailable: true,
    imageName: "d895f4f4b8dc239e436a5a267d378024e9b3d3fd42a56f66e1b4a4d8fcccd863"
  },
  {
    _id: "675de64c778fec23b3c68508",
    cookId: cookIds[3],
    name: "Idly vada",
    description: "some thing random",
    cuisineType: "INDIAN",
    cost: 15,
    rating: "-",
    createdAt: "Sat, 14 Dec 2024 20:10:52 GMT",
    isAvailable: true,
    imageName: "0b129bb889c889fc26daebb8cbcac53f75a0300ab807be31fd69abebfd46c91e",
    cookName: "janedoe"
  },
  {
    _id: "675de6dc778fec23b3c68509",
    cookId: cookIds[3],
    name: "Pizza",
    description: "Homemade mexican style",
    cuisineType: "MEXICAN",
    cost: 20,
    rating: "-",
    createdAt: "Sat, 14 Dec 2024 20:13:16 GMT",
    isAvailable: true,
    imageName: "a669134d569890a13840df6c40212df4a41df0a3256991c92a21dab81ab3bbe4"
  },
  {
    _id: "675de7e4033b6f1b9e0d879b",
    cookId: cookIds[5],
    name: "Grilled Cheese Sandwich",
    description: "very delicious",
    cuisineType: "ITALIAN",
    cost: 12,
    rating: "-",
    createdAt: "Sat, 14 Dec 2024 20:17:40 GMT",
    isAvailable: true,
    imageName: "3c3f1cc7790cd33fbb1e10d966c8de2b4e6ba339a6f56eec52a2f147a7d61610"
  },
  {
    _id: "675f10883ebbae378f43a1a3",
    cookId: cookIds[4],
    name: "Kulfi",
    description: "you love it",
    cuisineType: "INDIAN",
    cost: 10,
    rating: "-",
    createdAt: "Sun, 15 Dec 2024 17:23:20 GMT",
    isAvailable: true,
    imageName: "17ccb82132ac094ed53caeb1567011e3c28f47794a14c9819fe1b26d5180c6a1"
  },
  {
    _id: "675f10ab054612e003d778ed",
    cookId: cookIds[3],
    name: "Veg Biryani",
    description: "Rice with spiced vegetables",
    cuisineType: "INDIAN",
    cost: 12.5,
    rating: "-",
    createdAt: "Sun, 15 Dec 2024 17:23:55 GMT",
    isAvailable: false,
    imageName: "1567eeb0f435dbd2a96f1f6bfcb493e0a73f3d09937cc10b4bb5ae32450b6772",
    cookName: "doejane"
  },
  {
    _id: "675f14ff054612e003d778ee",
    cookId: cookIds[4],
    name: "Gulab Jamun",
    description: "GB",
    cuisineType: "INDIAN",
    cost: 9.99,
    rating: "-",
    createdAt: "Sun, 15 Dec 2024 17:42:23 GMT",
    isAvailable: true,
    imageName: "fe125ac277e9e537cc99439f5df57e711032291a587858f968c0bc75d2d8f4d6"
  },
  {
    _id: "675f1c77054612e003d778ef",
    cookId: cookIds[2],
    name: "Choco Lava Cake",
    description: "Chocolate cake with liquid chocolate filling",
    cuisineType: "AMERICAN",
    cost: 2.99,
    rating: "-",
    createdAt: "Sun, 15 Dec 2024 18:14:15 GMT",
    isAvailable: true,
    imageName: "24908e52b69ff01c5ed4cd18bc6b9747acf8883e0ddf4dbc9e2cc0215a8ce54f"
  },
  {
    _id: "67609fb7bd86894729bcbc1d",
    cookId: cookIds[0],
    name: "Aloo Samosa",
    description: "home made haryana style",
    cuisineType: "INDIAN",
    cost: 30,
    rating: "-",
    createdAt: "Mon, 16 Dec 2024 21:46:31 GMT",
    isAvailable: true,
    imageName: "5889cbef7f9e2c57bf87922ac4190f5d6bff7429a48e6903df72ed2566c45d4f"
  },
  {
    _id: "6760a7197daecee0eea5a8b8",
    cookId: cookIds[4],
    name: "Bhindi Curry",
    description: "u may become mathematician at once",
    cuisineType: "INDIAN",
    cost: 20,
    rating: "-",
    createdAt: "Mon, 16 Dec 2024 22:18:01 GMT",
    isAvailable: true,
    imageName: "3904b4d1c3a7418e0441b08a96d83ff9c50cb36bb867d3270516a08573d9dc6b"
  },
  {
    _id: "6763505dbb4e5264821ebda2",
    cookId:cookIds[2],
    name: "Masala Dosa",
    description: "Authentic style",
    cuisineType: "INDIAN",
    cost: 12,
    rating: "-",
    createdAt: "Wed, 18 Dec 2024 22:44:45 GMT",
    isAvailable: true,
    imageName: "5917d11e99e99350a4061cc34df64639640cd64491a5198fab29186bc98a13d5"
  }
];


  for (const dish of dishObjects) {
    await dishData.addDish(
      dish.cookId,
      dish.name,
      dish.description,
      dish.cuisineType,
      dish.cost,
      dish.imageName
    );
  }
// MEAL REQUESTS DATA


const mealRequestsSeedData = [
  {
    userId: userIds[6],
    noOfPeople: 7,
    description: "Request for vegetarian meal",
    cuisineType: "INDIAN",
    budget: 25,
    requiredBy: "12/25/2024"
  },
  {
    userId: userIds[7],
    noOfPeople: 10,
    description: "Request for vegan meal",
    cuisineType: "MEXICAN",
    budget: 35,
    requiredBy: "12/26/2024"
  },
  {
    userId: userIds[5],
    noOfPeople: 6,
    description: "Request for party meal",
    cuisineType: "ITALIAN",
    budget: 50,
    requiredBy: "12/27/2024"
  },
  {
    userId: userIds[6],
    noOfPeople: 8,
    description: "Request for birthday celebration",
    cuisineType: "INDIAN",
    budget: 75,
    requiredBy: "12/28/2024"
  },
  {
    userId: userIds[5],
    noOfPeople: 9,
    description: "Request for family dinner",
    cuisineType: "MEXICAN",
    budget: 90,
    requiredBy: "12/22/2024"
  }
];

for (const mealRequest of mealRequestsSeedData) {
  try {
    const result = await mealReqData.createMealreq(
      mealRequest.userId,
      mealRequest.noOfPeople,
      mealRequest.description,
      mealRequest.cuisineType,
      mealRequest.budget,
      mealRequest.requiredBy
    );
    console.log("Meal request created successfully:", result);
  } catch (error) {
    console.log(error)
    console.error("Error creating meal request:", error.message);
  }
}

console.log('Done seeding database');

await closeConnection();
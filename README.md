Dependencies to be installed and run before running server and client:
1. Redis Stack Server (Docker desktop)
2. ImageMagick
3. Change the configurations of mongoDB for building it on local in Server > config > settings.js
4. Seed the database navigate to Server and then run node seed.js

To run Server: 
1. Open terminal and navigate to Server
2. Execute 'npm i'
3. Execute 'npm start'

To run Client: 
1. Open terminal and navigate to Client
2. Execute 'npm i'
3. Execute 'npm run dev'

*** Student Email and Password for direct login ***
Email: nadellapraneeth26@gmail.com
Password: MSDhoni@7

*** Cook Email and Password for direct login ***
Email: praneeth26052000@gmail.com
Password: MSDhoni@7

***Payment - Stripe***
1. Payment is accepted only in card format
2. For payment method we support only cards. Please use the test cards from Stripe as we are using Stripe for handling payments.
    Test Cards link: https://docs.stripe.com/testing?testing-method=card-numbers
    Example Test Card Number : 4242424242424242
3. For the scope of our project we have considered tax on any order to be 6% of the total cost.
    
***Location Access***
1. The application will ask for access to location of your device to capture the co-ordinates of your location
2. The address of student / cook should be a real address for the latitude and longitude to be accurate

***Environment File: .env***
1. The .env files are placed in the Client and Server folders

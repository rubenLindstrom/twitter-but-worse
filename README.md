# twitter-but-worse
Full stack social media app, built with React, Node and Firebase Cloud Functions :family:

## See the website live

The website is deployed at [https://soccio-e29bc.web.app](https://soccio-e29bc.web.app). :earth_africa: 

## Client

To get going with the app, you run the following command in the root directory

#### `npm install`

After that you're good to go, and can run

#### `npm start`

to start the devlopment server. :tent:

### Tests

The app comes with Jest configured, but the test coverage is currently low. The idea is to complement the app with unit tests as well as some integration tests, to increase confidence when building it out. :microscope:

Tests can be run with

#### `npm test`


## Cloud functions

To get going with the backend, you can run the following command in the _functions_ directory :zap:

#### `npm install`

The functions are available by running 

#### `firebase serve`

### File structure

    .
    ├── functions                     # Contains all the cloud functions implementations      
    │   ├── handlers                  # Contains the raw functions that implement each route
    │   │  ├── posts.js               # Contains all the routes related to the posts, including comments and likes
    │   │  └── users.js               # Contains all the routes related to users, including authentication
    │   |── util                      # Contains commonly used utility
    │   │  ├── admin.js               # Contains the firebase admin sdk connection
    │   │  ├── auth.js                # Contains the authentication middleware, used on protected routes
    │   │  └── validators.js          # Contains input validators
    └── index.js.                     # Connects the handlers to their respective route, and implements triggers


# Trust Tower Defenders
A tower defense game using Vue.js, websockets and NodeJS with Express

## Installation
- Clone this repository to your machine

- Pick 1 of the below  
`npm run setup && npm run serve` Full install then start server   
`npm run setup && npm run build` Full install but does not start server

- Go to localhost:3000 and enjoy

For active development, please use `npm run serve` to propagate changes and start the server

## Environment variables
These are not required to set, but may be helpful if using hosts such as Heroku that have dynamic ports.
- **PORT**
The port to serve the app on
*Default: 3000*

- **WSSPORT**
The port to accept websocket connections on
*Default: 3030*

## How to use

#### Setup (required)
- Note: Only run if you did not setup using the installation instructions
`npm run setup`

#### Build
- Note: You must have run setup beforehand
`npm run build`

#### Build then launch
-   Note: You must have run setup beforehand
`npm run serve`  

#### Launch
- Note: You must have run setup and build/serve beforehand  
`npm run start`  
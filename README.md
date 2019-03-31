# SuperFireBros

### App url 
https://www.superfirebros.com or https://super-fire-bros.herokuapp.com

### Api Documentation
https://samuel-zhu.github.io/slate/#introduction

### Team Members 
Yiling(Samuel) Zhu, Yiwei(Gilbert) Guo, YongLi(Kyle) Liang  

<br></br>
<br></br>
## Description

##### A multiplayer game that allows more than 2 player join and play, players will be divided into two team, the first team scored 2000 will win the game
 
## Details
- Every player will be able to shot with fire.
- Collect a coin will score 15.
- Hit a player will score 10.
- Character allows to move left, right, up on the battleground.
- Players use left, right, up, left side shift button on Keyboard to control move left, right, up and fire.

## Key Features by Beta
- Have the playable game
- Handle user operations on backend(register, login, logout, join game, quit game)
- Be able to have two users login, join and play the game.
- Have a draft of the UI that will be improved by final version.

## Additional features by Final
- Improve UI/UX to ensure user experience
- Additional Optimizations (control, game logic, new characters etc) for the game
- Handle spectating to make sure login users can watch the live game and comment.
- Be able to login with google.

## Technology used
- Socket.io -  Frontend and backend real time communication and stream
- Express - Backend framework
- AngularJS/CLI - Frontend framework
- Angular Webpack - Frontend packaging
- Phaser3 - WebGL game development library
- Log4js - Logger
- Bcrypt -  Hashing and Salting
- MongoDB - Database
- NES.CSS - CSS framework
- Dotenv - Environment variable config setup
- Slate - Generating api Documentation template
- MailgunJS - For register email validation
- Google Authentication APIs and tokens
- Helmet - Express security strategy
- PassportJS - Jwt user authentication strategy
- Cloudflare - Custom domain, caching and security enhancement
- Heroku - Server deployment
- GithubPage - Api documentation page

## Challenges
- Deploythe app to Heroku and config on Cloudflare to apply custom domain with enhanced security
- Have the frontend and backend working with a newly learn framework AngularJS.
- Deliver the game using Phaser3 and web socket
- Use Socket.io to deliver real time communication for the game players and spectators
- Secure the whole application to ensure No bad, forbidden, cheating operations from users 

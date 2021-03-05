# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`
3. 'pip install python-socket-io'
4. pip install Flask

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
 

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## React Components
Under Src Game.js, index.css, and index.js.
Game.js takes Start component and Board component under components folder and imports it to create the tic tac toe board
Game.js takes the path and assembles both board and start to create board
Under Components folder/functional that is where I created most of the action components that are being done like the score board, the square, the visitor, and the wait, and the play again
Under Components/pages I created the board.js and the start.js which assembles the board, and starting the game.

## Styling
Making color font for the body and the code tags using whatever is in src/index.css

## Socket.io
Under server.py you need to import everything that you need for SOCKETIO such as SOCKETIO and emit
you need to initalize the socket using SOCKETIO(todo)
and then cors the app

Now you need to create a function for each type of connection
One for connecting, getting game status, any errors, newGame, for any visiting players, joining newRoom, win ,moving, and over
at the end of each function just like how you need to return usually you just do socket.emit with whatever you want to send to the client.

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Known Problems and Future Solutions/Features:
One of the known problems that I have at the moment is that it allows players(not spectators) to go when it's not their turn. If I had more time I would solve it by creating a lock during socket.io that doesn't allow the opposite player to click anywhere when it's their opponents turn

Another feature that I would add is the hover X or O function where determining who's turn it is if you were to hover over the board you can see that it hovers either an X or an O. You can do this with .overlay block in css that shows the opacity, position, and all other specs when it goes over each square in the board.

## Technical Issues that I had

The major technical issue I had was in deployment of Heroku I actually surprising never used react-starter and ended up doing everything from scratch which ended up causing me to have my react front end side out of order that heroku didn't like as it takes the files in a certain way. I ended up having to download react starter and mimicing the format of react-starter in my directory

Another issue that I had was after successfully deploying I ran the application and in the heroku logs it showed that there was an import error in Namespace. Now this one was particularly unusual because I never imported Namespace or had it in requirements.txt or in my python code. I tried uninstalling socket-io and reinstalling. Switching up my directory, and switching my requirements.txt which ended up working instead of doing pip freeze > requirements.txt I just typed in what I needed as something in the full pip freeze was causing problems.


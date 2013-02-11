beat-em-up
==========

Multiplayer Beat-Em-Up game with lobby, matches, punches and a chicken!

Made during a 24 hour hackathon at #GameHackDays - Feb 2013

**[Demo](http://moka.co:8080/)** - Requires **4** players, ask your friends to join!

Installation
==========

* Clone the repo.
* Install [node.js](http://nodejs.org/).
* Go to `/server`, install express.js (`npm install express`) and socket.io (`npm install socket.io`).
* Run the server (`node app.js`)
* Navigate in Chrome / Firefox / IE10 / iOS to [`localhost:8080`](http://localhost:8080)

Configuration
==========
By default the match size is **6** players (so you need at least six people to play). 
You can change that number in `server/modules/lobby.js` by edditing the `matchSize` variable. 
Ideally it should be an even number so that you have two teams of equal size.

Gameplay
==========
You can hit other people with the `Z`, `X`, and `C` keys, and walk with the arrow keys (`↑`, `↓`, `←`, `→`). 
Your team needs to pick up the chicken (by punching it, obviously) and keep hold of it to score points. 
The team with the highest score wins.


              ,~.
           ,-'__ `-,
          {,-'  `. }              ,')
         ,( a )   `-.__         ,',')~,
        <=.) (         `-.__,==' ' ' '}
          (   )                      /)
           `-'\   ,                    )
               |  \        `~.        /
               \   `._        \      /
                \     `._____,'    ,'
                 `-.             ,'
                    `-._     _,-'
                        77jj'
                       //_||
                    __//--'/`          
                  ,--'/`  '

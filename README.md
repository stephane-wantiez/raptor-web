raptor-web
==========

HTML5 game called "1945: Mission Raptor", inspired from "Raptor: Call of the Shadows" and the "1945" tutorial for GameMaker.

Created for the Web game programming course of SupInfoGame SIG4GP.


TODO:
- Add more feedbacks for enemy and player damages
- Add FlyingActor class with shadow generation (Player will also have that class as prototype)
- Add Building class for buildings (with Actor as prototype)
- Adapt game for touch screen (touch instead of mouse click? permanent shoot?)

Client-server part:
- login page with button "Login with Facebook"
- if session available, no login
- for each user, store: 1/ current game score, 2/ best game score

DB tables: see doc/serverClasses.uxf with UMLet
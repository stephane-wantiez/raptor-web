raptor-web
==========

HTML5 version of Raptor: Call of the Shadows

Created for the Web game programming course of SupInfoGame SIG4GP.


TODO:
- Get sprites of original game (w/ Camoto tool? DotEmu?)
- Get font for game
- Create code for scrolling scene (w/o player)
- Create AI of basic enemies
- Add weapons shooting for player (interacting with scene)
- Add collision checks between actors (player, weapons, enemies, building)
- Add FlyingActor class with shadow generation (Player will also have that class as prototype)
- Add FlyingEnemy class for flying enemies (with FlyingActor as prototype), with specialized class for each type of enemy
- Add Building class for buildings (with Actor as prototype)

Classes:

PositionChanger -> Actor -> FlyingActor -> FlyingEnemy -> classes of each type of enemy (to be defined)
                         |              -> Player
                         -> Building
Sprite
Camera
Game

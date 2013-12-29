raptor-web
==========

HTML5 version of Raptor: Call of the Shadows

Created for the Web game programming course of SupInfoGame SIG4GP.


TODO:
- Implement the graphics in canvas
- Get sprites of original game (w/ Camoto tool? DotEmu?) - or use sprites of 1942 (no more Raptor...)
- Get font for game
- Create AI of basic enemies
- Fix collision checks between player and enemy actors (player, weapons, enemies, building)
- Add FlyingActor class with shadow generation (Player will also have that class as prototype)
- Add FlyingEnemy class for flying enemies (with FlyingActor as prototype), with specialized class for each type of enemy
- Add Building class for buildings (with Actor as prototype)

Classes:

PositionChanger -> Actor -> MovingActor -> FlyingActor -> FlyingEnemy -> classes of each type of enemy (to be defined)
                         |              |              -> Player
                         |              -> Bullet
                         -> Building
Sprite
Camera
Scene
Game
utils

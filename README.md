raptor-web
==========

HTML5 game called "1945: Mission Raptor", inspired from "Raptor: Call of the Shadows" and the "1945" tutorial for GameMaker.

Created for the Web game programming course of SupInfoGame SIG4GP.


TODO:
- Fix boss alpha
- Fix shield value when game is reloaded (shields lost)
- Set "user-select: none" to CSS divs of interface (mouse selection issue).
- Remove SoundManager2 and use Audio tag instead.
- Add feedback for enemy and player damages
- Add feedback on score (+x on killed enemy)
- Add end screen with replay button
- Add start menu
- Get sprites of original game (w/ Camoto tool? DotEmu?) - or use sprites of 1942 (no more Raptor...)
- Get font for game
- Add FlyingActor class with shadow generation (Player will also have that class as prototype)
- Add Building class for buildings (with Actor as prototype)
- Adapt game for touch screen (touch instead of mouse click? permanent shoot?)

Classes:

PositionChanger -> Actor -> MovingActor -> FlyingActor -> FlyingEnemy -> classes of each type of enemy (to be defined)
                         |              |              -> Player
                         |              -> Projectile  -> Bullet
                         -> Building
Sprite
Scene
Game
utils

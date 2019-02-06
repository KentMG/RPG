This program opens a window and allows you to create a character then change weapons and fight.
It saves the player to a json file.
You can load from a json file.
Bugs:
	map is broken will fix tomorrow.
Fixed Bugs:
	map not rendering when player spawns away from wall.
	map colors being inconsistent rgba values.
	Array to limit ability to move through object being loaded with values incorrectly
	slow map loaded.
	map movement inaccurate loading
	incorrectly set map image
	map getting loaded into the wrong order into container array.
	missing occasional background image
	player not deleting sprite behind itself.
	

Features:
	Save
	Load
	Move on Map
	Fight in one on one combat
	Heal
	Change equipped Weapon
	multithreading

Map Colors:
	border: (0,0,0);
	water: (0, 51, 204);
	deepWater: (0, 0, 153)
	grass: (0, 102, 0);
	ground: (153, 153, 153);
	door: (255, 255, 102)
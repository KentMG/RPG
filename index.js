/********************************************************
 * Coded By: Kent Gunn and John McDaniel
 * Date: January 2019
 * CORDINATE SYSTEM IS (Y,X)
********************************************************/


/************************************
 * Variables
************************************/
let Player1;
let Enemies = [];
let Weapons = [];
let mapSize = [];
let map;
let BoardOverlay = [];

/************************************
 * Requires
************************************/
const Player = require('./Classes/Player').Player;
const Weapon = require('./Classes/Weapon').Weapon;
const util = require('util');
const fs = require('fs');
const electron = require('electron');
var getPixels = require("get-pixels")
const { ipcRenderer } = electron;

/************************************
 * Event Listeners
************************************/
document.addEventListener("keypress", function (e) {
	movePlayer(e);
})
/************************************
 * Map Setter
************************************/
getPixels("./Images/map.png", function (err, pixels) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(pixels)
	mapSize.push(pixels.shape[1])
	mapSize.push(pixels.shape[0])
	console.log(mapSize)
	map = pixels;
})

/************************************
 * Make Weapon List
************************************/
Weapons.push(new Weapon("Fists", 2, 3));
Weapons.push(new Weapon("Sword", 3, 3));

/************************************
 * Screens
************************************/
//Character Creation
function makeCharacter(name, race, gender) {
	Player1 = new Player(name, race, gender);
	Player1.WEAPON.push(Weapons[0]);
	Player1.INVENTORY.push(Weapons[0]);
	Player1.INVENTORY.push(Weapons[1]);
	clearScreen();
	viewCharStats();
	createMap();
	viewPlayScreen();
}
//Empty Screen of all but Stats
function clearScreen() {
	let CharCreate = document.getElementsByClassName("CharCreator");
	for (i = 0; i < CharCreate.length; i++) {
		CharCreate[i].style.display = 'none';
	}
	let playScreen = document.getElementsByClassName("playScreen");
	for (i = 0; i < playScreen.length; i++) {
		playScreen[i].style.display = 'none';
	}
	let invScreen = document.getElementsByClassName('inventoryScreen');
	for (i = 0; i < invScreen.length; i++) {
		invScreen[i].style.display = 'none';
	}
	let comScreen = document.getElementsByClassName('combatScreen');
	for (i = 0; i < comScreen.length; i++) {
		comScreen[i].style.display = 'none';
	}
}
//Show Stats
function viewCharStats() {
	let stats = document.getElementsByClassName('CharStats');
	for (i = 0; i < stats.length; i++) {
		stats[i].style.display = '';
	}
	document.getElementById('pStats').innerHTML = ("You are a " + Player1.RACE + " " + Player1.GENDER + " named " + Player1.NAME + ".");
}
//Show Main Menu
function viewPlayScreen() {
	let playScreen = document.getElementsByClassName('playScreen');
	for (i = 0; i < playScreen.length; i++) {
		playScreen[i].style.display = "";
	}
}
//Show Battle Screen
function viewCombat() {
	clearScreen();
	Enemies[0] = new Player("", "", "");
	Enemies[0].WEAPON.push(Weapons[1]);
	document.getElementById('enemyStats').innerHTML = "";
	document.getElementById('enderOfCombat').value = "Run";
	let battleScreen = document.getElementsByClassName('combatScreen');
	for (i = 0; i < battleScreen.length; i++) {
		battleScreen[i].style.display = "";
	}
}
//Show Inventory
function viewInventory() {
	clearScreen();
	let weapSelect = document.getElementById('weaponSelect');
	weapSelect.innerHTML = "";
	for (i = 0; i < Player1.INVENTORY.length; i++) {
		weapSelect.innerHTML += "<option value=" + Player1.INVENTORY[i] + ">" + Player1.INVENTORY[i].NAME + "</option>";
	}
	let invScreen = document.getElementsByClassName('inventoryScreen');
	for (i = 0; i < invScreen.length; i++) {
		invScreen[i].style.display = "";
	}
}
//Go to Main Menu
function toMenu() {
	clearScreen();
	viewPlayScreen();
}
//Build the Map
function createMap() {
	let Board = document.getElementById('Board');
	let whichRue = 0;
	//mapSize.push(map.Size[0]);
	//mapSize.push(map.Size[1]);
	let BoardWidth = mapSize[0];
	let BoardHeight = mapSize[1];
	document.getElementById('Board').style.display = "";
	for (i = 0; i < BoardHeight; i++) {
		console.log(i);
		for (j = 0; j < BoardWidth; j++) {
			Board.innerHTML += ("<img src='./Images/transparent.png' class='Tile' id='" + i + "-" + j + "' style='display:none; width:30px; height:30px;'/>");
		}
	}
	//Color Tiles
	let rowContent = [];
	for (var i = 0; i < map.data.length; i += 4) {
		if (i / 4 % mapSize[0] == 0 && i != 0) {
			BoardOverlay.push(rowContent);
			whichRue++;
			rowContent = [];
		}
		//Border
		if (map.data[i] < 3 && map.data[i + 1] < 3 && map.data[i + 2] < 3) {
			document.getElementById(whichRue + "-" + (i / 4 % 50)).style.background = 'url(./Images/border.png)';
			rowContent.push(0);
		}
		//Water
		else if (map.data[i] < 3 && map.data[i + 1] < 3 && (map.data[i + 2] >= 251 && map.data[i + 2] <= 255)) {
			document.getElementById(whichRue + "-" + (i / 4 % 50)).style.background = 'url(./Images/ocean.png)'
			rowContent.push(1);
		}
		//Grass
		else if (map.data[i] < 20 && map.data[i] > 15 && map.data[i + 1] > 125 && map.data[i + 1] < 130 && map.data[i + 2] < 5) {
			document.getElementById(whichRue + "-" + (i / 4 % 50)).style.background = 'url(./Images/grass.png)'
			rowContent.push(2);
		}
		//Ground
		else if (map.data[i] > 126 && map.data[i] < 132 && map.data[i + 1] > 126 && map.data[i + 1] < 132 && map.data[i + 2] > 126 && map.data[i + 2] < 132) {
			document.getElementById(whichRue + "-" + (i / 4 % 50)).style.background = 'url(./Images/ground.png)'
			rowContent.push(2);
		}
	}
	//Show map around Player
	if (Player1.X - 10 < 0) {
		for (var i = 0; i < 21; i++) {
			if (Player1.Y - 10 < 0) {
				for (var j = 0; j < 21; j++) {
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else if (Player1.Y + 10 >= mapSize[1]) {
				for (var j = mapSize[1] - 21; j < mapSize[1]; j++) {
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else {
				for (var j = Player1.Y - 10; j < Player1.Y + 11; j++) {
					if (i >= 0 && j < mapSize[1] && i < mapSize[0]) {
						document.getElementById(j + '-' + i).style.display = '';
					}
				}
			}
		}
	} else if (Player1.X + 10 >= mapSize[1]) {
		for (var i = mapSize[0] - 21; i < mapSize[0]; i++) {
			if (Player1.Y - 10 < 0) {
				for (var j = 0; j < 21; j++) {
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else if (Player1.Y + 10 >= mapSize[1]) {
				for (var j = mapSize[1] - 21; j < mapSize[1]; j++) {
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else {
				for (var j = Player1.Y - 10; j < Player1.Y + 11; j++) {
					if (i >= 0 && j < mapSize[1] && i < mapSize[0]) {
						document.getElementById(j + '-' + i).style.display = '';
					}
				}
			}
		}
	} else if (Player1.Y + 10 >= mapSize[0]) {
		for (var i = mapSize[1] - 21; i < mapSize[1]; i++) {
			if (Player1.X - 10 < 0) {
				for (var j = 0; j < 21; j++) {
					document.getElementById(i + '-' + j).style.display = '';
				}
			} else if (Player1.X + 10 >= mapSize[0]) {
				for (var j = mapSize[1] - 21; j < mapSize[0]; j++) {
					document.getElementById(i + '-' + j).style.display = '';
				}
			} else {
				for (var j = Player1.X - 10; j < Player1.X + 11; j++) {
					if (i >= 0 && j < mapSize[1] && i < mapSize[0]) {
						document.getElementById(i + '-' + j).style.display = '';
					}
				}
			}
		}
	} else if (Player1.Y - 10 < 0) {
		for (var i = 0; i < 21; i++) {
			if (Player1.X - 10 < 0) {
				for (var j = 0; j < 21; j++) {
					document.getElementById(i + '-' + j).style.display = '';
				}
			} else if (Player1.X + 10 >= mapSize[1]) {
				for (var j = mapSize[0] - 21; j < mapSize[0]; j++) {
					document.getElementById(i + '-' + j).style.display = '';
				}
			} else {
				for (var j = Player1.X - 10; j < Player1.X + 11; j++) {
					if (i >= 0 && Player1.X + 10 < mapSize[0] && i < mapSize[1]) {
						document.getElementById(i + '-' + j).style.display = '';
					}
				}
			}
		}
	}
	document.getElementById(Player1.Y + '-' + Player1.X).src = './Images/player.png'
}

/**********************************
 * Oustide File Manipulation
**********************************/
//Save to JSON
function saveFile() {
	let item = { 'Player': Player1 };
	fs.writeFile('Save.json', JSON.stringify(item, null, '\t'), (err) => {
		console.log(err);
	});
	//ipcRenderer.send('Player:save', JSON.stringify(toPush, null, 4));
}
//Load from JSON
function loadFile() {
	let save
	fs.readFile('Save.json', 'utf-8', (err, data) => {
		if (err) {
			throw err;
		}
		save = JSON.parse(data);
		Player1 = new Player;
		Player1.NAME = save.Player.NAME;
		Player1.RACE = save.Player.RACE;
		Player1.GENDER = save.Player.GENDER;
		Player1.WEAPON = save.Player.WEAPON;
		Player1.INVENTORY = save.Player.INVENTORY;
		Player1.HP = save.Player.HP;
		Player1.XP = save.Player.XP;
		clearScreen();
		viewCharStats();
		viewPlayScreen();
		createMap();
	});
}
/*function getMap(){
	fs.readFile('Map.json','utf-8',(err, data) => {
		if(err){
			throw err;
		}
		createMap(JSON.parse(data));
	});
}*/

/*********************************
 * Do Something to the Player
*********************************/
//Change Players Weapon
function changeWeapon() {
	Player1.changeWeapon();
}
//Heal
function Heal(amount) {
	Player1.Heal(amount);
	document.getElementById('pResources').innerHTML = Player1.getResources();
}

/****************************************
 * Player Interactions with Environment
****************************************/
//Do 1 round of combat
function Battle(player, enemy) {
	if (player.HP > 0) {
		enemy.GetHit(player.Attack());
	}
	if (enemy.HP > 0) {
		player.GetHit(enemy.Attack());
		document.getElementById('pResources').innerHTML = player.getResources();
	}
	if (enemy.HP <= 0) {
		document.getElementById('enemyStats').innerHTML = "You Win! Go to Menu to Reset.";
		document.getElementById('enderOfCombat').value = "Menu";
	}
	if (player.HP <= 0) {
		document.getElementById('enemyStats').innerHTML = "You Lost! Go to Menu to Reset.";
		document.getElementById('enderOfCombat').value = "Menu";
	}
}
//Move the Player
function movePlayer(e) {
	let map = document.getElementById('Board');
	if (e.key == 'w') {
		if (Player1.Y - 1 >= 0 && BoardOverlay[Player1.Y - 1][Player.X] != 0) {
			Player1.Y -= 1;
			document.getElementById(Player1.Y + '-' + Player1.X).src = "./Images/player.png";
			document.getElementById(Player1.Y + 1 + '-' + Player1.X).src = "./Images/transparent.png";

			if (Player1.X - 10 < 0) {
				for (var i = 0; i < 21; i++) {
					if (i >= 0 && Player1.Y - 10 >= 0 && i < mapSize[1]) {
						document.getElementById(Player1.Y - 10 + '-' + i).style.display = '';
						if (i >= 0 && Player1.Y + 11 < mapSize[0] && i < mapSize[1]) {
							document.getElementById(Player1.Y + 11 + '-' + i).style.display = 'none';
						}
					}
				}
			} else if (Player1.X + 10 >= mapSize[1]) {
				for (var i = mapSize[1] - 21; i < mapSize[1]; i++) {
					if (i >= 0 && Player1.Y - 10 >= 0 && i < mapSize[1]) {
						document.getElementById(Player1.Y - 10 + '-' + i).style.display = '';
						if (i >= 0 && Player1.Y + 11 < mapSize[0] && i < mapSize[1]) {
							document.getElementById(Player1.Y + 11 + '-' + i).style.display = 'none';
						}
					}
				}
			} else {
				for (var i = Player1.X - 10; i < Player1.X + 11; i++) {
					if (i >= 0 && Player1.Y - 10 >= 0 && i < mapSize[1]) {
						document.getElementById(Player1.Y - 10 + '-' + i).style.display = '';
						if (i >= 0 && Player1.Y + 11 < mapSize[0] && i < mapSize[1]) {
							document.getElementById(Player1.Y + 11 + '-' + i).style.display = 'none';
						}
					}
				}
			}
		}
	}
	if (e.key == 's') {
		if (Player1.Y + 1 < mapSize[0] && BoardOverlay[Player1.Y + 1][Player.X] != 0) {
			Player1.Y += 1;
			document.getElementById(Player1.Y + '-' + Player1.X).src = "./Images/player.png";
			document.getElementById(Player1.Y - 1 + '-' + Player1.X).src = "./Images/transparent.png";

			if (Player1.X - 10 < 0) {
				for (var i = 0; i < 21; i++) {
					if (i >= 0 && Player1.Y + 10 < mapSize[0] && i < mapSize[1]) {
						document.getElementById(Player1.Y + 10 + '-' + i).style.display = '';
						if (i >= 0 && Player1.Y - 11 >= 0 && i < mapSize[1]) {
							document.getElementById(Player1.Y - 11 + '-' + i).style.display = 'none';
						}
					}
				}
			} else if (Player1.X + 10 >= mapSize[1]) {
				for (var i = mapSize[1] - 21; i < mapSize[1]; i++) {
					if (i >= 0 && Player1.Y + 10 < mapSize[0] && i < mapSize[1]) {
						document.getElementById(Player1.Y + 10 + '-' + i).style.display = '';
						if (i >= 0 && Player1.Y - 11 >= 0 && i < mapSize[1]) {
							document.getElementById(Player1.Y - 11 + '-' + i).style.display = 'none';
						}
					}
				}
			} else {
				for (var i = Player1.X - 10; i < Player1.X + 11; i++) {
					if (i >= 0 && Player1.Y + 10 < mapSize[0] && i < mapSize[1]) {
						document.getElementById(Player1.Y + 10 + '-' + i).style.display = '';
						if (i >= 0 && Player1.Y - 11 >= 0 && i < mapSize[1]) {
							document.getElementById(Player1.Y - 11 + '-' + i).style.display = 'none';
						}
					}
				}
			}
		}
	}
	if (e.key == 'd') {
		if (Player1.X + 1 < mapSize[1] && BoardOverlay[Player1.Y][Player.X + 1] != 0) {
			Player1.X += 1;
			document.getElementById(Player1.Y + '-' + Player1.X).src = "./Images/Player.png";
			document.getElementById(Player1.Y + '-' + (Player1.X - 1)).src = "./Images/transparent.png";

			if (Player1.Y - 10 < 0) {
				for (var i = 0; i < 21; i++) {
					if (i >= 0 && Player1.X + 10 < mapSize[1] && i < mapSize[0]) {
						document.getElementById(i + '-' + (Player1.X + 10)).style.display = '';
						if (i >= 0 && Player1.X - 11 >= 0 && i < mapSize[0]) {
							document.getElementById(i + '-' + (Player1.X - 11)).style.display = 'none';
						}
					}
				}
			} else if (Player1.Y + 10 >= mapSize[0]) {
				for (var i = mapSize[0] - 21; i < mapSize[0]; i++) {
					if (i >= 0 && Player1.X + 10 < mapSize[1] && i < mapSize[0]) {
						document.getElementById(i + '-' + (Player1.X + 10)).style.display = '';
						if (i >= 0 && Player1.X - 11 >= 0 && i < mapSize[0]) {
							document.getElementById(i + '-' + (Player1.X - 11)).style.display = 'none';
						}
					}
				}
			} else {
				for (var i = Player1.Y - 10; i < Player1.Y + 11; i++) {
					if (i >= 0 && Player1.X + 10 < mapSize[1] && i < mapSize[0]) {
						document.getElementById(i + '-' + (Player1.X + 10)).style.display = '';
						if (i >= 0 && Player1.X - 11 >= 0 && i < mapSize[0]) {
							document.getElementById(i + '-' + (Player1.X - 11)).style.display = 'none';
						}
					}
				}
			}
		}
	}
	if (e.key == 'a') {
		if (Player1.X - 1 >= 0 && BoardOverlay[Player1.Y][Player.X - 1] != 0) {
			Player1.X -= 1;
			document.getElementById(Player1.Y + '-' + Player1.X).src = "./Images/Player.png";
			document.getElementById(Player1.Y + '-' + (Player1.X + 1)).src = "./Images/transparent.png";
			if (Player1.Y - 10 < 0) {
				for (var i = 0; i < 21; i++) {
					if (i >= 0 && Player1.X - 10 >= 0 && i < mapSize[0]) {
						document.getElementById(i + '-' + (Player1.X - 10)).style.display = '';
						if (i >= 0 && Player1.X + 11 < mapSize[0] && i < mapSize[0]) {
							document.getElementById(i + '-' + (Player1.X + 11)).style.display = 'none';
						}
					}
				}
			} else if (Player1.Y + 10 >= mapSize[0]) {
				for (var i = mapSize[0] - 21; i < mapSize[0]; i++) {
					if (i >= 0 && Player1.X - 10 >= 0 && i < mapSize[0]) {
						document.getElementById(i + '-' + (Player1.X - 10)).style.display = '';
						if (i >= 0 && Player1.X + 11 < mapSize[0] && i < mapSize[0]) {
							document.getElementById(i + '-' + (Player1.X + 11)).style.display = 'none';
						}
					}
				}
			} else {
				for (var i = Player1.Y - 10; i < Player1.Y + 11; i++) {
					if (i >= 0 && Player1.X - 10 >= 0 && i < mapSize[0]) {
						document.getElementById(i + '-' + (Player1.X - 10)).style.display = '';
						if (i >= 0 && Player1.X + 11 < mapSize[0] && i < mapSize[0]) {
							document.getElementById(i + '-' + (Player1.X + 11)).style.display = 'none';
						}
					}
				}
			}
		}
	}
}
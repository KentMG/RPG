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
let workers = [];
let Board = [];

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
 * Map Setter
************************************/
getPixels("./Images/map.png", function (err, pixels) {
	getPixels("", function(err2, pixel2){
	if (err) {
		console.log(err);
		return;
	}
	mapSize.push(pixels.shape[1])
	mapSize.push(pixels.shape[0])
	//Make a DIV and Board Array Element for each row of the map
	for (i = 0; i < mapSize[0]; i++) {
		document.getElementById('Board').innerHTML += "<div id='Board" + i + "' class='Row'></div>";
		BoardOverlay.push("")
		Board.push("");
	}
	//Make one worker per row
	for (i = 0; i < mapSize[1]; i++) {
		workers.push(new Worker('createMap.js'));
		let giveToWorkers = [i, pixels, pixels2];
		workers[i].postMessage(giveToWorkers);
	}

	/****************************************
	 * Create Event Listeners Dynamically
	****************************************/
	for (i = 0; i < workers.length; i++) {
		workers[i].addEventListener('message', (d) => {
			let row = d.data[2];
			BoardOverlay[row] = d.data[1];
			Board[row] = d.data[0];
		});
	}
})


/*
getPixels("./Images/room" + i + ".png", function (err, pixels) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(pixels)
})
getPixels("./Images/room2.png", function (err, pixels) {
	if (err) {
		console.log(err);
		return;
	}
})
*/

/************************************
 * Event Listeners
************************************/
document.addEventListener("keypress", function (e) {
	movePlayer(e);
});

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
	showMapAroundPlayer();
	viewPlayScreen();
}
//Empty Screen of all but Stats
function clearScreen() {
	let CharCreate = document.getElementsByClassName("CharCreator");
	for (i = 0; i < CharCreate.length; i++) {
		CharCreate[i].style.display = 'none';
	}
	document.getElementById("playScreen").style.display = 'none';
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
	document.getElementById("MenuBox").style.display = "";
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

//Show map around Player
function showMapAroundPlayer() {
	for (i = 0; i < workers.length; i++) {
		workers[i].terminate();
	}
	document.getElementById('Board').style.display = "";
	if (Player1.X - 10 < 0) {
		for (var i = 0; i < 21; i++) {
			if (Player1.Y - 10 < 0) {
				for (var j = 0; j < 21; j++) {
					if (document.getElementById('Board' + j).innerHTML == "") {
						document.getElementById('Board' + j).innerHTML = Board[j];
					}
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else if (Player1.Y + 10 >= mapSize[1]) {
				for (var j = mapSize[1] - 21; j < mapSize[1]; j++) {
					if (document.getElementById('Board' + j).innerHTML == "") {
						document.getElementById('Board' + j).innerHTML = Board[j];
					}
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else {
				for (var j = Player1.Y - 10; j < Player1.Y + 11; j++) {
					if (document.getElementById('Board' + j).innerHTML == "") {
						document.getElementById('Board' + j).innerHTML = Board[j];
					}
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
					if (document.getElementById('Board' + j).innerHTML == "") {
						document.getElementById('Board' + j).innerHTML = Board[j];
					}
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else if (Player1.Y + 10 >= mapSize[1]) {
				for (var j = mapSize[1] - 21; j < mapSize[1]; j++) {
					if (document.getElementById('Board' + j).innerHTML == "") {
						document.getElementById('Board' + j).innerHTML = Board[j];
					}
					document.getElementById(j + '-' + i).style.display = '';
				}
			} else {
				for (var j = Player1.Y - 10; j < Player1.Y + 11; j++) {
					if (i >= 0 && j < mapSize[1] && i < mapSize[0]) {
						if (document.getElementById('Board' + j).innerHTML == "") {
							document.getElementById('Board' + j).innerHTML = Board[j];
						}
						document.getElementById(j + '-' + i).style.display = '';
					}
				}
			}
		}
	} else if (Player1.Y + 10 >= mapSize[0]) {
		for (var i = mapSize[1] - 21; i < mapSize[1]; i++) {

			if (document.getElementById('Board' + i).innerHTML == "") {
				document.getElementById('Board' + i).innerHTML = Board[i];
			}
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
	} else {
		for (var i = Player1.Y - 10; i < Player1.Y + 11; i++) {
			if (document.getElementById('Board' + i).innerHTML == "") {
				document.getElementById('Board' + i).innerHTML = Board[i];
			}
			for (var j = Player1.X - 10; j < Player1.X + 11; j++) {
				document.getElementById(i + '-' + j).style.display = '';
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
		showMapAroundPlayer();
	});
}

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
		if (Player1.Y - 1 >= 0 && BoardOverlay[Player1.Y - 1][Player1.X] != 0) {
			Player1.Y -= 1;
			if (Player1.Y - 10 >= 0) {
				if (document.getElementById('Board' + (Player1.Y - 10)).innerHTML == "") {
					document.getElementById('Board' + (Player1.Y - 10)).innerHTML = Board[Player1.Y - 10];
				}
			}
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
		if (Player1.Y + 1 < mapSize[0] && BoardOverlay[Player1.Y + 1][Player1.X] != 0) {
			Player1.Y += 1;
			if (Player1.Y + 10 < mapSize[0]) {
				if (document.getElementById('Board' + (Player1.Y + 10)).innerHTML == "") {
					document.getElementById('Board' + (Player1.Y + 10)).innerHTML = Board[Player1.Y + 10];
				}
			}
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
		if (Player1.X + 1 < mapSize[1] && BoardOverlay[Player1.Y][Player1.X + 1] != 0) {
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
		if (Player1.X - 1 >= 0 && BoardOverlay[Player1.Y][Player1.X - 1] != 0) {
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
/********************************************************
 * Coded By: Kent Gunn and John McDaniel
 * Date: January 2019
 * CORDINATE SYSTEM IS (Y,X)
********************************************************/


/************************************
 * Variables
************************************/
{
	let Player1;
	let Enemies = [];
	let Weapons = [];
	let mapSize = [];
	let map2Size = [];
	let map;
	let workers = [];
	let BoardOverlay = [];
	let Board = [];
	let RoomOverlay = [];
	let Room = [];
	let inMap = true;
}

/************************************
 * Requires
************************************/
{
	const Player = require('./Classes/Player').Player;
	const Weapon = require('./Classes/Weapon').Weapon;
	const util = require('util');
	const fs = require('fs');
	const electron = require('electron');
	var getPixels = require("get-pixels")
	const { ipcRenderer } = electron;
}

/************************************
 * Map Setter
************************************/
{
	//Set initial map
	getPixels("./Images/map.png", function (err, pixels) {
		if (err) {
			console.log(err);
			return;
		}
		getPixels("./Images/mapBackground.png", function (err2, pixels2) {
			if (err2) {
				console.log(err2);
				return;
			}
			mapSize.push(pixels.shape[1])
			mapSize.push(pixels.shape[0])
			//Make a DIV and Board Array Element for each row of the map
			for (i = 0; i < mapSize[0]; i++) {
				if(inMap){
				document.getElementById('Board').innerHTML += "<div id='Board" + i + "' class='Row'></div>";
				BoardOverlay.push("")
				Board.push("");
				}
				else{
					document.getElementById('Room').innerHTML += "<div id='Room" + i + "' class='Row'></div>";
					RoomOverlay.push("")
					Room.push("");
				}
			}
			//Make one worker per row
			for (i = 0; i < mapSize[1]; i++) {
				workers.push(new Worker('createMap.js'));
				let giveToWorkers = [i, pixels, pixels2, inMap];
				workers[i].postMessage(giveToWorkers);
			}

			/****************************************
			 * Create Event Listeners Dynamically
			****************************************/
			for (i = 0; i < workers.length; i++) {
				workers[i].addEventListener('message', (d) => {
					let inMap2 = d.data[3];
					let row = d.data[2]
					if(inMap2){;
					BoardOverlay[row] = d.data[1];
					Board[row] = d.data[0];
				}
				else{
					RoomOverlay[row] = d.data[1];
					Room[row] = d.data[0];
				}
				});
			}
		})
	})

	//Set Board 2
	function enterNewMap(mapName) {
		getPixels("./Images/" + mapName, function (err, pixels) {
			if (err) {
				console.log(err);
				return;
			}
			map2Size[0] = (pixels.shape[1])
			map2Size[1] = (pixels.shape[0])
			//Make a DIV and Board Array Element for each row of the map
			for (i = 0; i < mapSize[0]; i++) {
				document.getElementById('Room').innerHTML += "<div id='Room" + i + "' class='Row'></div>";
				RoomOverlay.push("")
				Room.push("");
			}
			//Make one worker per row
			for (i = 0; i < mapSize[1]; i++) {
				workers[i] = new Worker('createMap.js');
				let giveToWorkers = [i, pixels];
				workers[i].postMessage(giveToWorkers);
			}

			/****************************************
			 * Create Event Listeners Dynamically
			****************************************/
			for (i = 0; i < workers.length; i++) {
				workers[i].addEventListener('message', (d) => {
					let row = d.data[2];
					RoomOverlay[row] = d.data[1];
					Room[row] = d.data[0];
				});
			}
		})
	}
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
}

/************************************
 * Event Listeners
************************************/
{
	document.addEventListener("keypress", function (e) {
		movePlayer(e);
	});
}
/************************************
 * Make Weapon List
************************************/
{
	Weapons.push(new Weapon("Fists", 2, 3));
	Weapons.push(new Weapon("Sword", 3, 3));
}

/************************************
 * Screens
************************************/
{
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
		let X = Player1.X;
		let Y = Player1.Y;
		let BName = "Board";
		let YSize = mapSize[0];
		let XSize = mapSize[1];
		let Delimiter = "-";
		if (!inMap) {
			X = Player1.X2;
			Y = Player1.Y2;
			BName = "Room";
			YSize = map2Size[0];
			XSize = map2Size[1];
			Delimiter = "_";
		}
		for (i = 0; i < workers.length; i++) {
			workers[i].terminate();
		}
		document.getElementById('BName').style.display = "";
		if (X - 10 < 0) {
			for (var i = 0; i < 21; i++) {
				if (Y - 10 < 0) {
					for (var j = 0; j < 21; j++) {
						if (document.getElementById('BName' + j).innerHTML == "") {
							document.getElementById('BName' + j).innerHTML = BName[j];
						}
						document.getElementById(j + Delimiter + i).style.display = '';
					}
				} else if (Y + 10 >= XSize) {
					for (var j = XSize - 21; j < XSize; j++) {
						if (document.getElementById('BName' + j).innerHTML == "") {
							document.getElementById('BName' + j).innerHTML = BName[j];
						}
						document.getElementById(j + Delimiter + i).style.display = '';
					}
				} else {
					for (var j = Y - 10; j < Y + 11; j++) {
						if (document.getElementById('BName' + j).innerHTML == "") {
							document.getElementById('BName' + j).innerHTML = BName[j];
						}
						if (i >= 0 && j < XSize && i < YSize) {
							document.getElementById(j + Delimiter + i).style.display = '';
						}
					}
				}
			}
		} else if (X + 10 >= XSize) {
			for (var i = YSize - 21; i < YSize; i++) {
				if (Y - 10 < 0) {
					for (var j = 0; j < 21; j++) {
						if (document.getElementById('BName' + j).innerHTML == "") {
							document.getElementById('BName' + j).innerHTML = BName[j];
						}
						document.getElementById(j + Delimiter + i).style.display = '';
					}
				} else if (Y + 10 >= XSize) {
					for (var j = XSize - 21; j < XSize; j++) {
						if (document.getElementById('BName' + j).innerHTML == "") {
							document.getElementById('BName' + j).innerHTML = BName[j];
						}
						document.getElementById(j + Delimiter + i).style.display = '';
					}
				} else {
					for (var j = Y - 10; j < Y + 11; j++) {
						if (i >= 0 && j < XSize && i < YSize) {
							if (document.getElementById('BName' + j).innerHTML == "") {
								document.getElementById('BName' + j).innerHTML = BName[j];
							}
							document.getElementById(j + Delimiter + i).style.display = '';
						}
					}
				}
			}
		} else if (Y + 10 >= YSize) {
			for (var i = XSize - 21; i < XSize; i++) {

				if (document.getElementById('BName' + i).innerHTML == "") {
					document.getElementById('BName' + i).innerHTML = BName[i];
				}
				if (X - 10 < 0) {
					for (var j = 0; j < 21; j++) {
						document.getElementById(i + Delimiter + j).style.display = '';
					}
				} else if (X + 10 >= YSize) {
					for (var j = XSize - 21; j < YSize; j++) {
						document.getElementById(i + Delimiter + j).style.display = '';
					}
				} else {
					for (var j = X - 10; j < X + 11; j++) {
						if (i >= 0 && j < XSize && i < YSize) {
							document.getElementById(i + Delimiter + j).style.display = '';
						}
					}
				}
			}
		} else if (Y - 10 < 0) {
			for (var i = 0; i < 21; i++) {
				if (X - 10 < 0) {
					for (var j = 0; j < 21; j++) {
						document.getElementById(i + Delimiter + j).style.display = '';
					}
				} else if (X + 10 >= XSize) {
					for (var j = YSize - 21; j < YSize; j++) {
						document.getElementById(i + Delimiter + j).style.display = '';
					}
				} else {
					for (var j = X - 10; j < X + 11; j++) {
						if (i >= 0 && X + 10 < YSize && i < XSize) {
							document.getElementById(i + Delimiter + j).style.display = '';
						}
					}
				}
			}
		} else {
			for (var i = Y - 10; i < Y + 11; i++) {
				if (document.getElementById('BName' + i).innerHTML == "") {
					document.getElementById('BName' + i).innerHTML = BName[i];
				}
				for (var j = X - 10; j < X + 11; j++) {
					document.getElementById(i + Delimiter + j).style.display = '';
				}
			}
		}
		document.getElementById(Y + Delimiter + X).src = './Images/player.png'
	}
}

/**********************************
 * Oustide File Manipulation
**********************************/
{
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
}

/*********************************
 * Do Something to the Player
*********************************/
{
	//Change Players Weapon
	function changeWeapon() {
		Player1.changeWeapon();
	}
	//Heal
	function Heal(amount) {
		Player1.Heal(amount);
		document.getElementById('pResources').innerHTML = Player1.getResources();
	}
}

/****************************************
 * Player Interactions with Environment
****************************************/
{
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
		let X = Player1.X;
		let Y = Player1.Y;
		let BName = "Board";
		let YSize = mapSize[0];
		let XSize = mapSize[1];
		let Delimiter = "-";
		if (!inMap) {
			X = Player1.X2;
			Y = Player1.Y2;
			BName = "Room";
			YSize = map2Size[0];
			XSize = map2Size[1];
			Delimiter = "_";
		}
		if (e.key == 'w') {
			if (Y - 1 >= 0 && BoardOverlay[Y - 1][X] != 0) {
				Y -= 1;
				if (Y - 10 >= 0) {
					if (document.getElementById(BName + (Y - 10)).innerHTML == "") {
						document.getElementById(BName + (Y - 10)).innerHTML = Board[Y - 10];
					}
				}
				document.getElementById(Y + Delimiter + X).src = "./Images/player.png";
				document.getElementById(Y + 1 + Delimiter + X).src = "./Images/transparent.png";

				if (X - 10 < 0) {
					for (var i = 0; i < 21; i++) {
						if (i >= 0 && Y - 10 >= 0 && i < XSize) {
							document.getElementById(Y - 10 + Delimiter + i).style.display = '';
							if (i >= 0 && Y + 11 < YSize && i < XSize) {
								document.getElementById(Y + 11 + Delimiter + i).style.display = 'none';
							}
						}
					}
				} else if (X + 10 >= XSize) {
					for (var i = XSize - 21; i < XSize; i++) {
						if (i >= 0 && Y - 10 >= 0 && i < XSize) {
							document.getElementById(Y - 10 + Delimiter + i).style.display = '';
							if (i >= 0 && Y + 11 < YSize && i < XSize) {
								document.getElementById(Y + 11 + Delimiter + i).style.display = 'none';
							}
						}
					}
				} else {
					for (var i = X - 10; i < X + 11; i++) {
						if (i >= 0 && Y - 10 >= 0 && i < XSize) {
							document.getElementById(Y - 10 + Delimiter + i).style.display = '';
							if (i >= 0 && Y + 11 < YSize && i < XSize) {
								document.getElementById(Y + 11 + Delimiter + i).style.display = 'none';
							}
						}
					}
				}
			}
		}
		if (e.key == 's') {
			if (Y + 1 < YSize && BoardOverlay[Y + 1][X] != 0) {
				Y += 1;
				if (Y + 10 < YSize) {
					if (document.getElementById(BName + (Y + 10)).innerHTML == "") {
						document.getElementById(BName + (Y + 10)).innerHTML = Board[Y + 10];
					}
				}
				document.getElementById(Y + Delimiter + X).src = "./Images/player.png";
				document.getElementById(Y - 1 + Delimiter + X).src = "./Images/transparent.png";

				if (X - 10 < 0) {
					for (var i = 0; i < 21; i++) {
						if (i >= 0 && Y + 10 < YSize && i < XSize) {
							document.getElementById(Y + 10 + Delimiter + i).style.display = '';
							if (i >= 0 && Y - 11 >= 0 && i < XSize) {
								document.getElementById(Y - 11 + Delimiter + i).style.display = 'none';
							}
						}
					}
				} else if (X + 10 >= XSize) {
					for (var i = XSize - 21; i < XSize; i++) {
						if (i >= 0 && Y + 10 < YSize && i < XSize) {
							document.getElementById(Y + 10 + Delimiter + i).style.display = '';
							if (i >= 0 && Y - 11 >= 0 && i < XSize) {
								document.getElementById(Y - 11 + Delimiter + i).style.display = 'none';
							}
						}
					}
				} else {
					for (var i = X - 10; i < X + 11; i++) {
						if (i >= 0 && Y + 10 < YSize && i < XSize) {
							document.getElementById(Y + 10 + Delimiter + i).style.display = '';
							if (i >= 0 && Y - 11 >= 0 && i < XSize) {
								document.getElementById(Y - 11 + Delimiter + i).style.display = 'none';
							}
						}
					}
				}
			}
		}
		if (e.key == 'd') {
			if (X + 1 < XSize && BoardOverlay[Y][X + 1] != 0) {
				X += 1;
				document.getElementById(Y + Delimiter + X).src = "./Images/Player.png";
				document.getElementById(Y + Delimiter + (X - 1)).src = "./Images/transparent.png";

				if (Y - 10 < 0) {
					for (var i = 0; i < 21; i++) {
						if (i >= 0 && X + 10 < XSize && i < YSize) {
							document.getElementById(i + Delimiter + (X + 10)).style.display = '';
							if (i >= 0 && X - 11 >= 0 && i < YSize) {
								document.getElementById(i + Delimiter + (X - 11)).style.display = 'none';
							}
						}
					}
				} else if (Y + 10 >= YSize) {
					for (var i = YSize - 21; i < YSize; i++) {
						if (i >= 0 && X + 10 < XSize && i < YSize) {
							document.getElementById(i + Delimiter + (X + 10)).style.display = '';
							if (i >= 0 && X - 11 >= 0 && i < YSize) {
								document.getElementById(i + Delimiter + (X - 11)).style.display = 'none';
							}
						}
					}
				} else {
					for (var i = Y - 10; i < Y + 11; i++) {
						if (i >= 0 && X + 10 < XSize && i < YSize) {
							document.getElementById(i + Delimiter + (X + 10)).style.display = '';
							if (i >= 0 && X - 11 >= 0 && i < YSize) {
								document.getElementById(i + Delimiter + (X - 11)).style.display = 'none';
							}
						}
					}
				}
			}
		}
		if (e.key == 'a') {
			if (X - 1 >= 0 && BoardOverlay[Y][X - 1] != 0) {
				X -= 1;
				document.getElementById(Y + Delimiter + X).src = "./Images/Player.png";
				document.getElementById(Y + Delimiter + (X + 1)).src = "./Images/transparent.png";
				if (Y - 10 < 0) {
					for (var i = 0; i < 21; i++) {
						if (i >= 0 && X - 10 >= 0 && i < YSize) {
							document.getElementById(i + Delimiter + (X - 10)).style.display = '';
							if (i >= 0 && X + 11 < YSize && i < YSize) {
								document.getElementById(i + Delimiter + (X + 11)).style.display = 'none';
							}
						}
					}
				} else if (Y + 10 >= YSize) {
					for (var i = YSize - 21; i < YSize; i++) {
						if (i >= 0 && X - 10 >= 0 && i < YSize) {
							document.getElementById(i + Delimiter + (X - 10)).style.display = '';
							if (i >= 0 && X + 11 < YSize && i < YSize) {
								document.getElementById(i + Delimiter + (X + 11)).style.display = 'none';
							}
						}
					}
				} else {
					for (var i = Y - 10; i < Y + 11; i++) {
						if (i >= 0 && X - 10 >= 0 && i < YSize) {
							document.getElementById(i + Delimiter + (X - 10)).style.display = '';
							if (i >= 0 && X + 11 < YSize && i < YSize) {
								document.getElementById(i + Delimiter + (X + 11)).style.display = 'none';
							}
						}
					}
				}
			}
		}
	}
}
/********************************************************
 * Coded By: Kent Gunn
 * Date: January 2019
********************************************************/


/************************************
 * Variables
************************************/
let Player1;
let Enemies = [];
let Weapons = [];
let mapSize=[];

/************************************
 * Requires
************************************/
const Player =  require('./Classes/Player').Player;
const Weapon = require('./Classes/Weapon').Weapon;
const util = require('util');
const fs = require('fs');
const electron = require('electron');
const {ipcRenderer} = electron;

/************************************
 * Make Weapon List
************************************/
Weapons.push(new Weapon("Fists",2,3));
Weapons.push(new Weapon("Sword",3,3));

/************************************
 * Screens
************************************/
//Character Creation
function makeCharacter(name, race, gender){
	Player1 = new Player(name, race, gender);
	Player1.WEAPON.push(Weapons[0]);
	Player1.INVENTORY.push(Weapons[0]);
	Player1.INVENTORY.push(Weapons[1]);
	clearScreen();
	viewCharStats();
	getMap();
	viewPlayScreen();
}
//Empty Screen of all but Stats
function clearScreen(){
	let CharCreate = document.getElementsByClassName("CharCreator");
	for(i=0;i<CharCreate.length;i++){
		CharCreate[i].style.display='none';
	}
	let playScreen = document.getElementsByClassName("playScreen");
	for(i=0;i<playScreen.length;i++){
		playScreen[i].style.display='none';
	}
	let invScreen = document.getElementsByClassName('inventoryScreen');
	for(i=0;i<invScreen.length;i++){
		invScreen[i].style.display='none';
	}
	let comScreen = document.getElementsByClassName('combatScreen');
	for(i=0;i<comScreen.length;i++){
		comScreen[i].style.display='none';
	}
}
//Show Stats
function viewCharStats(){
	let stats = document.getElementsByClassName('CharStats');
	for(i=0; i<stats.length;i++){
		stats[i].style.display = '';
		}
	document.getElementById('pStats').innerHTML = ("You are a " + Player1.RACE + " " + Player1.GENDER + " named " + Player1.NAME + ".");
}
//Show Main Menu
function viewPlayScreen(){
	let playScreen = document.getElementsByClassName('playScreen');
	for(i=0;i<playScreen.length;i++){
		playScreen[i].style.display = "";
	}
}
//Show Battle Screen
function viewCombat(){
	clearScreen();
	Enemies[0]=new Player("","","");
	Enemies[0].WEAPON.push(Weapons[1]);
	document.getElementById('enemyStats').innerHTML="";
	document.getElementById('enderOfCombat').value="Run";
	let battleScreen = document.getElementsByClassName('combatScreen');
	for(i=0;i<battleScreen.length;i++){
		battleScreen[i].style.display = "";
	}
}
//Show Inventory
function viewInventory(){
	clearScreen();
	let weapSelect=document.getElementById('weaponSelect');
	weapSelect.innerHTML="";
	for(i=0;i<Player1.INVENTORY.length;i++){
		weapSelect.innerHTML+="<option value=" + Player1.INVENTORY[i] + ">" + Player1.INVENTORY[i].NAME + "</option>";
	}
	let invScreen = document.getElementsByClassName('inventoryScreen');
	for(i=0;i<invScreen.length;i++){
		invScreen[i].style.display="";
	}
}
//Go to Main Menu
function toMenu(){
	clearScreen();
	viewPlayScreen();
}
//Build the Map
function createMap(map){
	let Board=document.getElementById('Board');
	mapSize.push(map.Size[0]);
	mapSize.push(map.Size[1]);
	let BoardWidth=map.Size[0];
	let BoardHeight=map.Size[1];
	document.getElementById('Board').style.display="";
	for(i=0;i<BoardHeight;i++){
		for(j=0;j<BoardWidth;j++){
			Board.innerHTML+=("<img src='./Images/map.jpg' class='Tile' id='" + i + "-" + j + "' style='display:none; width:30px; height:30px;'/>");
			console.log(i + j);
		}
	}
	for(i=0;i<21;i++){
		for(j=0;j<21;j++){
			document.getElementById(i + "-" + j).style.display = "";
		}
	}
}

/**********************************
 * Oustide File Manipulation
**********************************/
//Save to JSON
function saveFile(){
	let item = {'Player' : Player1};
	fs.writeFile('Save.json', JSON.stringify(item, null, '\t'), (err) => {
		console.log(err);
	});
	//ipcRenderer.send('Player:save', JSON.stringify(toPush, null, 4));
}
//Load from JSON
function loadFile(){
	let save
	fs.readFile('Save.json','utf-8',(err, data) => {
		if(err){
			throw err;
		}
		save = JSON.parse(data);
		Player1 = new Player;
		Player1.NAME=save.Player.NAME;
		Player1.RACE=save.Player.RACE;
		Player1.GENDER=save.Player.GENDER;
		Player1.WEAPON=save.Player.WEAPON;
		Player1.INVENTORY=save.Player.INVENTORY;
		Player1.HP=save.Player.HP;
		Player1.XP=save.Player.XP;
		clearScreen();
		viewCharStats();
		viewPlayScreen();
	});
}
function getMap(){
	fs.readFile('Map.json','utf-8',(err, data) => {
		if(err){
			throw err;
		}
		createMap(JSON.parse(data));
	});
}

/*********************************
 * Do Something to the Player
*********************************/
//Change Players Weapon
function changeWeapon(){
	Player1.changeWeapon();
}
//Heal
function Heal(amount){
	Player1.Heal(amount);
	document.getElementById('pResources').innerHTML = Player1.getResources();
}

/****************************************
 * Player Interactions with Environment
****************************************/
//Do 1 round of combat
function Battle(player, enemy){
	if(player.HP>0){
		enemy.GetHit(player.Attack());
	}
	if(enemy.HP>0){
		player.GetHit(enemy.Attack());
		document.getElementById('pResources').innerHTML = player.getResources();
	}
	if(enemy.HP<=0){
		document.getElementById('enemyStats').innerHTML="You Win! Go to Menu to Reset.";
		document.getElementById('enderOfCombat').value="Menu";
	}
	if(player.HP<=0){
		document.getElementById('enemyStats').innerHTML="You Lost! Go to Menu to Reset.";
		document.getElementById('enderOfCombat').value="Menu";
	}
}
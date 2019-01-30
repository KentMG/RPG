class Weapon{
	constructor(name, damage, toHit){
		this.NAME=name;
		this.DAMAGE=damage;
		this.TOHIT=toHit;
	}
}

let fists= new Weapon("Fists",2,3);
let sword = new Weapon("Sword",3,3);

class Player{
	
	constructor(name, race, gender){
		this.NAME = name;
		this.RACE = race;
		this.GENDER = gender;
		this.XP=0;
		this.HP=10;
		this.WEAPON=fists;
		this.INVENTORY=[fists,sword];
	}
}

let Player1;
let Enemies = [];


const util = require('util');
const fs = require('fs');
const electron = require('electron');
const {ipcRenderer} = electron;

function makeCharacter(name, race, gender){
	Player1 = new Player(name, race, gender);
	clearScreen();
	viewCharStats();
	viewPlayScreen();
}

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
}

function viewCharStats(){
	let stats = document.getElementsByClassName('CharStats')
	for(i=0; i<stats.length;i++){
		stats[i].style.display = '';
		}
	document.getElementById('pStats').innerHTML = ("You are a " + Player1.RACE + " " + Player1.GENDER + " named " + Player1.NAME + ".");
}

function viewPlayScreen(){
	let playScreen = document.getElementsByClassName('playScreen');
	for(i=0;i<playScreen.length;i++){
		playScreen[i].style.display = "";
	}
}

function viewInventory(){
	clearScreen();
	let weapSelect=document.getElementById('weaponSelect');
	weapSelect.innerHTML="";
	for(i=0;i<Player1.INVENTORY.length;i++){
		weapSelect.innerHTML+="<option value='" + Player1.INVENTORY[i].NAME + "'>" + Player1.INVENTORY[i].NAME + "</option>";
	}
	let invScreen = document.getElementsByClassName('inventoryScreen');
	for(i=0;i<invScreen.length;i++){
		invScreen[i].style.display="";
	}
}

function changeWeapon(weapName){
	for(i=0;i<Player1.INVENTORY.length;i++){
		if(Player1.INVENTORY[i].NAME==weapName.NAME){
			Player1.WEAPON=Player1.INVENTORY[i];
		}
	}
}

function saveFile(){
	let item = {'Player' : Player1}
	fs.writeFile('Save.json', JSON.stringify(item, null, '\t'), (err) => {
		console.log(err);
	})
	//ipcRenderer.send('Player:save', JSON.stringify(toPush, null, 4));
}

function toMenu(){
	clearScreen();
	viewPlayScreen();
}
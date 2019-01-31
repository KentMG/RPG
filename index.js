class Weapon{
	constructor(name, damage, toHit){
		this.NAME=name;
		this.DAMAGE=damage;
		this.TOHIT=toHit;
	}
}

let fists= new Weapon("Fists",2,3);
let sword = new Weapon("Sword",3,3);



let Player1;
let Enemies = [];

const Player =  require('./Classes/Player').Player;
const util = require('util');
const fs = require('fs');
const electron = require('electron');
const {ipcRenderer} = electron;
//Character Creation
function makeCharacter(name, race, gender){
	Player1 = new Player(name, race, gender);
	Player1.WEAPON.push(fists);
	Player1.INVENTORY.push(fists);
	Player1.INVENTORY.push(sword);
	clearScreen();
	viewCharStats();
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
//Save to JSON
function saveFile(){
	let item = {'Player' : Player1};
	fs.writeFile('Save.json', JSON.stringify(item, null, '\t'), (err) => {
		console.log(err);
	});
	//ipcRenderer.send('Player:save', JSON.stringify(toPush, null, 4));
}
//Go to Main Menu
function toMenu(){
	clearScreen();
	viewPlayScreen();
}
//Do 1 round of combat
function Battle(player, enemy){
	if(player.HP>0){
		enemy.GetHit(player.Attack());
	}
	if(enemy.HP>0){
		player.GetHit(enemy.Attack());
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
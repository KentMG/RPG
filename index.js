class Weapon{
	constructor(name, damage, toHit){
		this.NAME=name;
		this.DAMAGE=damage;
		this.TOHIT=toHit;
	}
}
class Player{
	
	constructor(name, race, gender){
		this.NAME = name;
		this.RACE = race;
		this.GENDER = gender;
		this.XP=0;
		this.HP=10;
		this.WEAPON= new Weapon("Fists",2,3);
		let sword = new Weapon("Sword",3,3);
		this.INVENTORY=[this.WEAPON,sword];
	}
}
let Player1;
let Enemies = [];

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
	let inventoryScreen = document.getElementsByClassName('');
	for(i=0;i<inventoryScreen.length;i++){
		inventoryScreen.style.display='none';
	}
}

function viewCharStats(){
	var stats = document.getElementsByClassName('CharStats')
	for(i=0; i<stats.length;i++){
		stats[i].style.display = '';
		}
	document.getElementById('pStats').innerHTML = ("You are a " + Player1.RACE + " " + Player1.GENDER + " named " + Player1.NAME + ".");
}

function viewPlayScreen(){
	var playScreen = document.getElementsByClassName('playScreen');
	for(i=0;i<playScreen.length;i++){
		playScreen[i].style.display = "";
	}
}

function viewInventory(){
	var invScreen=document.getElementsByClassName('inventoryScreen');
	fori=0;i<invScreen.length;i++){
		invScreen[i].style.display="";
	}
}
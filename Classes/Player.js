/********************************************************
 * Coded By: Kent Gunn
 * Date: January 2019
********************************************************/


class Player{
	
	constructor(name, race, gender){
		this.NAME = name;
		this.RACE = race;
		this.GENDER = gender;
		this.LEVEL = 1;
		this.XP=0;
		this.HP=10;
		this.MANA=10;
		this.MaxHP=10;
		this.WEAPON=[];
		this.INVENTORY=[];
		this.X=30;
		this.Y=49;
	}
	//Change Equipped Weapon
	changeWeapon(){
		let selectBox=document.getElementById('weaponSelect');
		let weapon=selectBox.options[selectBox.selectedIndex].text;
		this.WEAPON.pop();
		for(i=0;i<this.INVENTORY.length;i++){
			if(weapon == this.INVENTORY[i].NAME){
				this.WEAPON.push(this.INVENTORY[i]);
			}
		}
}	
	//Attack
	Attack(){
		let damage = this.WEAPON[0].DAMAGE;
		return damage;
	}
	//Take Damage
	GetHit(damage){
		this.HP=this.HP-damage;
	}
	//Recover up to max health
	Heal(amount){
		this.HP+=amount;
		if(this.HP > this.MaxHP){
			this.HP=this.MaxHP;
		}
	}
	getResources(){
		let resources = "HP:" + this.HP + " Mana:" + this.MANA + " Level:" + this.LEVEL;
		return resources;
	}
}

exports.Player = Player;
class Player{
	
	constructor(name, race, gender){
		this.NAME = name;
		this.RACE = race;
		this.GENDER = gender;
		this.XP=0;
		this.HP=10;
		this.WEAPON=[];
		this.INVENTORY=[];
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
}

exports.Player = Player;
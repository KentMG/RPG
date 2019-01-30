const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const util = require('util');

let win;

//Start Window
function boot(){
	//Create newWindow
	win = new BrowserWindow()
	//Load html into window
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes:true
	}))
	
    win.webContents.openDevTools();
	//Build Menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
}

ipcMain.on('Player:save',function(item){
	item = util.inspect(item);
	fs.writeFile('Save.json', item, (err) => {
		console.log(err);
	})
})

const mainMenuTemplate = [
	{
		label:'File',
		submenu:[
			{
				label:'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

//If mac, add empty object to menubar
if(process.platform == 'darwin'){
	mainMenuTemplate.unshift({label:''});
}

//Listen for app to be ready
app.on('ready', boot); 

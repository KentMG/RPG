const {app, BrowserWindow, Menu} = require('electron');
const url = require('url');
const path = require('path');

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

const mainMenuTemplate = [
	{
		label:'File',
		submenu:[{
				label:'Save'
			},
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
	mainMenuTemplate.unshift({});
}

//Listen for app to be ready
app.on('ready', boot); 

//C:/Electron folder

const electron = require('electron');
const url  = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({});
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build Menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//Create menu Template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Start',
                click(){
                    //ON Click on STart start game
                }
            },
            {
                label: 'Restart'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                    'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                    'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
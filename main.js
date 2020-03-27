//C:/Electron folder


const electron = require('electron');
const url  = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

// Storage for users score
const storage = require('electron-json-storage');
const defaultDataPath = storage.getDefaultDataPath()


storage.set( 'UnoIceSharp', {score: 50}, function(error) {
    if (error) throw error;
});

storage.getAll(function(error, data) {
    if (error) throw error;
    console.log(data);
});


let mainWindow;
let prefWindow;

// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({webPreferences:{nodeIntegration:true}});
    prefWindow = new BrowserWindow({parent:mainWindow, modal:true, show: false, webPreferences:{nodeIntegration:true}});

    prefWindow.loadURL("file://" + __dirname + '/prefs.html')
    prefWindow.once('ready-to-show', () =>{prefWindow.show()})
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
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

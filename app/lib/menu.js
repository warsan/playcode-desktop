// Electron
const electron = require('electron')

const app = electron.app
const appName = app.getName()
const appVersion = app.getVersion()
const appMenu = electron.Menu

const templateWin = [{
    label: 'Файл',
    submenu: [{
        label: 'Скрыть ' + appName,
        accelerator: 'Control+H',
        role: 'hide'
    }, {
        type: 'separator'
    }, {
        label: 'Выход',
        accelerator: 'Control+W',
        role: 'close'
    }]
}, {
    label: 'Edit',
    submenu: [{
        label: 'Назад',
        accelerator: 'Control+Z',
        role: 'undo'
    }, {
        label: 'Далее',
        accelerator: 'Shift+Control+Z',
        role: 'redo'
    }, {
        type: 'separator'
    }, {
        label: 'Вырезать',
        accelerator: 'Control+X',
        role: 'cut'
    }, {
        label: 'Копировать',
        accelerator: 'Control+C',
        role: 'copy'
    }, {
        label: 'Вставить',
        accelerator: 'Control+V',
        role: 'paste'
    }, {
        label: 'Выбрать все',
        accelerator: 'Control+A',
        role: 'selectall'
    }]
}, {
    label: 'Смотреть',
    submenu: [{
        label: 'Назад',
        accelerator: 'Backspace',
        click(item, focusedWindow) {
            if (focusedWindow && focusedWindow.webContents.canGoBack()) {
                focusedWindow.webContents.goBack()
                focusedWindow.webContents.reload()
            }
        }
    }, {
        type: 'separator'
    }, {
        label: 'Reload',
        accelerator: 'F5',
        click(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.webContents.reload()
            }
        }
    }, {
        type: 'separator'
    }, {
        label: 'Toggle Dev Tools',
        accelerator: 'F12',
        click(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.webContents.toggleDevTools()
            }
        }
    }]
}, {
    label: 'Window',
    role: 'window',
    submenu: [{
        label: 'Minimize',
        accelerator: 'Control+M',
        role: 'minimize'
    }, {
        label: 'Close',
        accelerator: 'Control+W',
        role: 'close'
    }]
}, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'About ' + appName,
        click() {
            require('electron').shell.openExternal('https://github.com/Meadowcottage/Playcode/releases/tag/' + appVersion)
        }
    }, {
        label: 'Version ' + appVersion,
        enabled: false
    }, {
        type: 'separator'
    }, {
        label: 'View ' + appName,
        click() {
            require('electron').shell.openExternal('https://playcode.io')
        }
    }, {
        type: 'separator'
    }, {
        label: 'Changelog',
        click() {
            require('electron').shell.openExternal('https://github.com/Meadowcottage/Playcode/releases/tag/' + appVersion)
        }
    }]
}]

const templateOSX = [{
    label: 'Application',
    submenu: [{
        label: 'Hide ' + appName,
        accelerator: 'Command+H',
        role: 'hide'
    }, {
        type: 'separator'
    }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
            app.quit()
        }
    }]
}, {
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        role: 'undo'
    }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        role: 'redo'
    }, {
        type: 'separator'
    }, {
        label: 'Cut',
        accelerator: 'Command+X',
        role: 'cut'
    }, {
        label: 'Copy',
        accelerator: 'Command+C',
        role: 'copy'
    }, {
        label: 'Paste',
        accelerator: 'Command+V',
        role: 'paste'
    }, {
        label: 'Select All',
        accelerator: 'Command+A',
        role: 'selectall'
    }]
}, {
    label: 'View',
    submenu: [{
        label: 'Back',
        accelerator: 'Command+Left',
        click(item, focusedWindow) {
            if (focusedWindow && focusedWindow.webContents.canGoBack()) {
                focusedWindow.webContents.goBack()
                focusedWindow.webContents.reload()
            }
        }
    }, {
        type: 'separator'
    }, {
        label: 'Reload',
        accelerator: 'Command+R',
        click(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.webContents.reload()
            }
        }
    }, {
        type: 'separator'
    }, {
        label: 'Toggle Dev Tools',
        accelerator: 'F12',
        click(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.webContents.toggleDevTools()
            }
        }
    }]
}, {
    label: 'Window',
    role: 'window',
    submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        role: 'minimize'
    }, {
        label: 'Close',
        accelerator: 'Command+W',
        role: 'close'
    }]
}, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'About ' + appName,
        click() {
            require('electron').shell.openExternal('https://github.com/Meadowcottage/Playcode/releases/tag/' + appVersion)
        }
    }, {
        label: 'Version ' + appVersion,
        enabled: false
    }, {
        type: 'separator'
    }, {
        label: 'View ' + appName,
        click() {
            require('electron').shell.openExternal('https://playcode.io')
        }
    }, {
        type: 'separator'
    }, {
        label: 'Changelog',
        click() {
            require('electron').shell.openExternal('https://github.com/Meadowcottage/Playcode/releases/tag/' + appVersion)
        }
    }]
}]

if (process.platform === 'darwin') {
    module.exports = appMenu.buildFromTemplate(templateOSX)
} else {
    module.exports = appMenu.buildFromTemplate(templateWin)
}

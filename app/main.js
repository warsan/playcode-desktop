// System paths
const path = require('path')
const fs = require('fs')

// Electron
const electron = require('electron')

const globalShortcut = electron.globalShortcut
const menu = electron.Menu

// App Info
const app = electron.app
const appTitle = app.getName()
const appIsDev = require('electron-is-dev')
const appConfig = require('./lib/config.js')

// Правый клик/Содержимое контекстного меню
require('electron-context-menu')()

// Главное окно приложения
let mainWindow

// Если приложение выходит
let isQuitting = false

// Главное окно
function createMainWindow() {

  const lastWindowState = appConfig.get('lastWindowState')
  const appView = new electron.BrowserWindow({
    title: appTitle,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    backgroundColor: '#2b2b2b',
    titleBarStyle: 'hidden-inset',
    //transparent: false,
    // frame: false,
    center: true,
    movable: true,
    resizable: true,
    fullscreenable: true,
    autoHideMenuBar: true,
  })
  appView.loadURL('https://playcode.io')
  // appView.loadURL('http://localhost:5001')

  // Когда окно закрыто, скрыть окно
  appView.on('close', e => {
    if ( !isQuitting ) {
      e.preventDefault()
      if ( process.platform === 'darwin' ) {
        app.hide()
      } else {
        app.quit()
      }
    }
  })

  // Вход в полноэкранный режим воспроизведения для Playcode.
  appView.on('enter-full-screen', () => {
    appView.webContents.executeJavaScript('document.dispatchEvent( new Event("electronEnteredFullscreen") );')
  })

  // Выход из полноэкранного режима Playcode.
  appView.on('leave-full-screen', () => {
    appView.webContents.executeJavaScript('document.dispatchEvent( new Event("electronLeavedFullscreen") );')
  })

  return appView
}

app.on('ready', () => {
  const version = app.getVersion()

  mainWindow = createMainWindow()

  // Настройка меню приложения
  menu.setApplicationMenu(require('./lib/menu.js'))

  // Если работает в среде разработчика = Открыть инструменты разработчика
  if ( appIsDev ) {
    mainWindow.openDevTools()
  }

  const appPage = mainWindow.webContents

  appPage.on('dom-ready', () => {

    // Глобальные дополнения стиля
    appPage.insertCSS(fs.readFileSync(path.join(__dirname, 'app.css'), 'utf8'))

    // Исправления в стиле ТОЛЬКО для MacOS
    if ( process.platform === 'darwin' ) {
      appPage.insertCSS('')
    }

    // Добавка версии приложения в глобальном коде
    appPage.executeJavaScript(`window.electronAppVersion = '${version}';`)

    // Глобальные дополнения к коду
    appPage.executeJavaScript(fs.readFileSync(path.join(__dirname, 'renderer.js'), 'utf8'))

    // Показать главное окно
    mainWindow.show()

    // Открыть внешние ссылки в браузере
    appPage.on('new-window', ( e, url ) => {
      e.preventDefault()
      electron.shell.openExternal(url)
    })

    // Ярлык для перезагрузки страницы.
    // globalShortcut.register('CmdOrCtrl+R', (item, focusedWindow) => {
    //     if (focusedWindow) {
    //         mainWindow.webContents.reload()
    //     }
    // })
    // Ярлык, чтобы вернуться на страницу.
    // globalShortcut.register('Command+Left', ( item, focusedWindow ) => {
    //   if ( focusedWindow && focusedWindow.webContents.canGoBack() ) {
    //     focusedWindow.webContents.goBack()
    //     focusedWindow.webContents.reload()
    //   }
    // })

    // Навигация по окну назад, когда пользователь нажимает кнопку мыши назад
    mainWindow.on('app-command', ( e, cmd ) => {
      if ( cmd === 'browser-backward' && mainWindow.webContents.canGoBack() ) {
        mainWindow.webContents.goBack()
      }
    })
  })
})

app.on('window-all-closed', () => {
  if ( process.platform !== 'darwin' ) {
    app.quit()
  }
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  isQuitting = true

  // Сохраняет текущую позицию окна и размер окна в файле конфигурации.
  if ( !mainWindow.isFullScreen() ) {
    appConfig.set('lastWindowState', mainWindow.getBounds())
  }
})

app.on('will-quit', () => {
  // Отмена регистрации всех ярлыков.
  globalShortcut.unregisterAll()
})

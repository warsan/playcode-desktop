const assert = require('assert')
const electron = require('electron')
const Application = require('spectron').Application

const app = new Application({
    path: electron,
    args: ['app']
})

describe('App Testing:', function () {
    this.timeout(10000)

    beforeEach(() => {
        return app.start()
    })

    it('Window Tests', () => {
        app.start().then(() => {
            // Проверьте, видно ли окно
            return app.browserWindow.isVisible()
        }).then(isVisible => {
            // Убедитесь, что окно видно
            assert.equal(isVisible, true)
        }).then(() => {
            // Получить заголовок окна
            return app.client.getTitle()
        }).then(title => {
            // Проверьте заголовок окна
            assert.equal(title, 'Playcode')
        }).then(() => {
            // Остановить приложение
            return app.stop()
        }).catch(err => {
            // Журнал любых сбоев
            console.err('Test failed', err.message)
        })
    })

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop()
        }
    })
})

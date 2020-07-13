const {BrowserWindow, app, ipcMain} = require('electron')
const {Config} = require('./lib/Config')
const mysql = require('mysql')

require('electron-reload')(__dirname)

let window = null
let connection = null
let database = null
let table = null
const config = new Config();


const connect = (creds) => {
    const tempConnection = mysql.createConnection({
        user: creds.username,
        password: creds.password,
        port: 3306,
        host: 'localhost'
    })
    tempConnection.connect()
    return tempConnection
}


app.on('ready', () => {
    window = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (config.exists('username') && config.exists('password')) {

        console.log('USER CREDS EXISTS')

        connection = connect({
            username: config.get('username'),
            password: config.get('password')
        })
        window.loadFile('database.html')
    } else {
        console.log('USER CREDS DOES NOT EXISTS')
        window.loadFile('home.html')
    }
})


ipcMain.on('connect', (event, args) => {
    config.set('username', args[0])
    config.set('password', args[1])
    connection = connect({
        username: config.get('username'),
        password: config.get('password')
    })
    window.loadFile('database.html')
})


ipcMain.on('gotoDatabase', (event, args) => {
    database = args
    window.loadFile('tables.html')
})


ipcMain.on('goBacktoDatabases', (event, args) => {
    window.loadFile('database.html')
})


ipcMain.on('getDatabases', (event) => {
    connection.query('show databases', (error, results, fields) => {
        if (error) throw error
        let databases = []
        results.forEach(element => {
            databases.push(element[fields[0].name])
        });
        event.returnValue = databases
    })
})


ipcMain.on('getTables', (event) => {
    connection.query('show tables in ' + database, (error, results, fields) => {
        if (error) throw error
        let tables = []
        results.forEach(element => {
            tables.push(element[fields[0].name])
        });
        event.returnValue = tables
    })
})


ipcMain.on('gotoTables', (event, args) => {
    table = args
    window.loadFile('data.html')
})


ipcMain.on('goHome', (event, args) => {
    window.loadFile('home.html')
})

ipcMain.on('create-database', (event, dbName) => {
    connection.query('create database ' + dbName, () => {
        event.sender.send('database-updated')
    })
})

ipcMain.on('delete-database', (event, dbname) => {
    connection.query('drop database ' + dbname, () => {
        event.sender.send('database-updated')
    })
})
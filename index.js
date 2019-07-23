const { BrowserWindow , app, ipcMain }  = require('electron')
const mysql = require('mysql')

require('electron-reload')(__dirname)

let window = null
let connection = null

let database = null
let table = null

app.on('ready',() => {
    window = new BrowserWindow({
        width : 1000,
        height : 800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    window.loadFile('home.html')
})

ipcMain.on('connect', (event,args)=>{
    connection = mysql.createConnection({
        user: args[0],
        password: args[1],
        port: 3306,
        host: 'localhost'
    })
    connection.connect()
    window.loadFile('database.html')
})


ipcMain.on('gotoDatabase', (event,args)=>{
    database = args
    window.loadFile('tables.html')
})


ipcMain.on('getDatabases', (event) => {
    connection.query('show databases', (error,results,fields) => {
        if (error) throw error
        let databases = []
        results.forEach(element => {
            databases.push(element[fields[0].name])
        });
        event.returnValue = databases
    })
})

ipcMain.on('getTables',(event)=>{
    connection.query('show tables in ' + database,(error,results,fields)=>{
        if(error) throw error
        let tables = []
        results.forEach(element => {
            tables.push(element[fields[0].name])
        });
        event.returnValue = tables
    })
})

ipcMain.on('gotoTables', (event,args) => {
    table = args
    window.loadFile('data.html')
})
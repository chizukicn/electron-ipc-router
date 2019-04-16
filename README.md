# Promisify Electron IpcRouter

Installation
--

> 
    npm install electron-ipc-router --save-dev
    or
    yarn add electron-ipc-router ---dev

Use
--
> 
    const IpcRouter = require("electron-ipc-router")
    const {ipcMain} = require("electron")
    const router=new IpcRouter({
          ipc:ipcMain,
          routes:[
            "test":function(args){
                return Promise.resolve(args)
            }
          ]
    })
    router.send("test","Hello World")
        .then(console.log)

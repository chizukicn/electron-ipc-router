# Promisify Electron IpcRouter

Installation
--

> 
    npm install html-webpack-ext-cdn-plugin --save-dev
    or
    yarn add html-webpack-ext-cdn-plugin ---dev

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

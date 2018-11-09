/***
 @author kritsu
 @date 2018/11/9 19:03
 **/

import q from "q"

export default class IpcRouter {
    constructor({ipc, routes={}}) {
        for(let name in routes){
            let process=routes[name]
            ipc.on(name, (event, args) => {
                let callback = rs => event.sender.send(name, rs)
                process(args, {callback})
                    .then(callback)
            })
        }
        this.ipc = ipc
        this.routes = routes
    }

    send(command, args) {
        this.ipc.send(command, args)
        let defer = q.defer()
        this.ipc.once(command, (event, result) => defer.resolve(result))
        return defer.promise
    }

    sending(command, args, callback) {
        this.ipc.send(command, args)
        let defer = q.defer()
        this.ipc.on(command, (event, result) => {
            if (result) {
                callback(result)
            } else {
                defer.resolve({})
            }
        })
        return defer.promise
    }

}

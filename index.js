/***
 @author kritsu
 @date 2018/11/9 19:03
 **/

import q from "q"

export default class IpcRouter {
    constructor({ipc, routes = {}}) {
        this.ipc = ipc
        this.routes = {}
        for (let payload in routes) {
            let handle = routes[payload]
            this.on(payload, handle)
        }
    }


    on(payload, handle) {
        this.routes[payload] = handle
        this.ipc.on(payload, (event, args) => {
            const callback = rs => event.sender.send(payload, rs)
            let promise = handle(args, {callback})
            if (!!promise) {
                if (!promise instanceof Promise) {
                    promise = Promise.resolve(promise)
                }
                promise.then(callback)
            }
        })
    }

    emit(payload, args) {
        this.ipc.send(payload, args)
        let defer = q.defer()
        this.ipc.once(payload, (event, result) => defer.resolve(result))
        return defer.promise
    }

    listen(payload, args, callback) {
        this.ipc.send(payload, args)
        let defer = q.defer()
        this.ipc.on(payload, (event, result) => {
            if (result) {
                callback(result)
            } else {
                defer.resolve({})
            }
        })
        return defer.promise
    }

}

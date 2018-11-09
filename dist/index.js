"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /***
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      @author kritsu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      @date 2018/11/9 19:03
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      **/

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IpcRouter = function () {
    function IpcRouter(_ref) {
        var ipc = _ref.ipc,
            _ref$routes = _ref.routes,
            routes = _ref$routes === undefined ? {} : _ref$routes;

        _classCallCheck(this, IpcRouter);

        var _loop = function _loop(name) {
            var process = routes[name];
            ipc.on(name, function (event, args) {
                var callback = function callback(rs) {
                    return event.sender.send(name, rs);
                };
                process(args, { callback: callback }).then(callback);
            });
        };

        for (var name in routes) {
            _loop(name);
        }
        this.ipc = ipc;
        this.routes = routes;
    }

    _createClass(IpcRouter, [{
        key: "send",
        value: function send(command, args) {
            this.ipc.send(command, args);
            var defer = _q2.default.defer();
            this.ipc.once(command, function (event, result) {
                return defer.resolve(result);
            });
            return defer.promise;
        }
    }, {
        key: "sending",
        value: function sending(command, args, callback) {
            this.ipc.send(command, args);
            var defer = _q2.default.defer();
            this.ipc.on(command, function (event, result) {
                if (result) {
                    callback(result);
                } else {
                    defer.resolve({});
                }
            });
            return defer.promise;
        }
    }]);

    return IpcRouter;
}();

exports.default = IpcRouter;
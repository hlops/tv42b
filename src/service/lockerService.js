'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Q = require("q");
var Singleton = (function () {
    function Singleton() {
    }
    Singleton.getLock = function (id) {
        if (!this.locks.hasOwnProperty(id)) {
            this.locks[id] = Q();
        }
        return this.locks[id];
    };
    Singleton.setLock = function (id, operation) {
        var lock = this.getLock(id);
        return this.locks[id] = lock.then(function () { return operation(lock); });
    };
    return Singleton;
}());
Singleton.locks = {};
function getLock(id) {
    return Singleton.getLock(id);
}
exports.getLock = getLock;
function setLock(id, operation) {
    return Singleton.setLock(id, operation);
}
exports.setLock = setLock;

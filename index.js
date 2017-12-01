class Evented {
    constructor() {
        this.callbacks = {}
    }

    getCallbacks(event) {
        if (!Object.prototype.hasOwnProperty.call(this.callbacks, event)) {
            this.callbacks[event] = [];
        }
        return this.callbacks[event];
    }

    on(event, callback) {
        let cbs = this.getCallbacks(event)
        if (typeof event === 'function') cbs.push(event);
    }

    trigger(event, data) {
        let cbs = this.getCallbacks(event);
        cbs.forEach(cb => {
            if (typeof cb === 'function') { }
        })
    }
}

module.exports = Evented;

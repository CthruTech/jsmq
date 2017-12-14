class Evented {
    constructor() {
        this.callbacks = {};
        this.debug = false;
    }

    getCallbacks(event) {
        if (!Object.prototype.hasOwnProperty.call(this.callbacks, event)) {
            this.callbacks[event] = [];
        }
        return this.callbacks[event];
    }

    on(event, callback) {
        let cbs = this.getCallbacks(event);
        if (typeof callback === 'function') cbs.push(callback);
    }

    trigger(event, data) {
        let cbs = this.getCallbacks(event);
        this.debug && console.log(`Event Triggered: ${event}`, data);
        cbs.forEach(cb => {
            if (typeof cb === 'function') {
                cb(data);
            }
        });
    }
}

module.exports = Evented;

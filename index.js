/* eslint-disable valid-jsdoc */
/* global document, window */
const Evented = require('@cthru/evented');


/**
 * Javascript Media Query 
 * 
 * @class JSMQ
 */
class Util {
    static timeout(fn, interval, dontStart) {
        return (function(fn, interval, dontStart) {
            const t = {
                interval,
                resource: 0,
                get done() { return this.resource === 0; },
                get running() { return this.resource !== 0; },
                start() {
                    if (this.done) {
                        this.resource = window.setTimeout(() => {
                            this.resource = 0;
                            fn();
                        }, this.interval);
                    }
                }
            };
            if (!dontStart) t.start();
            return t;
        })(fn, interval, dontStart);
    }

    static throttle(fn, interval) {
        return (function() {
            let t = Util.timeout(fn, interval, true);
            let nfn = function() {
                t.start();
            };
            nfn.timeout = t;
            nfn.now = function() {
                fn();
            };
            return nfn;
        })();
    }
}




class JSMQ extends Evented {

    /**
     * Creates an instance of JSMQ.
     * @memberof JSMQ
     */
    constructor(config = {}) {
        super();

        this.breakpoints = {};

        this.config = Object.assign({
            classTarget: document.body,
            autoAttach: true,
            throttle: 100
        }, config || {});


        let self = this;
        this.changeHandler = Util.throttle(function() {
            let windowWidth = window.innerWidth;
            let targetElement = this.config.classTarget || document.body;
            let jsmqClassList = Object.values(this.breakpoints).map(bp => bp.className);
            let targetBaseClassList = targetElement.className.split(' ').filter(cls => jsmqClassList.indexOf(cls) < 0);
            let targetJsmqClassList = targetElement.className.split(' ').filter(cls => jsmqClassList.indexOf(cls) >= 0);
            let activeJsmqClassList = Object.values(this.breakpoints).filter(bp => windowWidth >= bp.minWidth && windowWidth <= bp.maxWidth).map(bp => bp.className);

            targetElement.className = [...activeJsmqClassList, ...targetBaseClassList].join(' ');
            let newTargetJsmqClassList = activeJsmqClassList.filter(bp => targetJsmqClassList.indexOf(bp) < 0);
            let remTargetJsmqClassList = targetJsmqClassList.filter(bp => activeJsmqClassList.indexOf(bp) < 0);

            remTargetJsmqClassList.forEach(bp => {
                for (let breakpointName in self.breakpoints) {
                    let breakpoint = self.breakpoints[breakpointName];
                    if (breakpoint.className === bp) {
                        let eventName = `${breakpointName}:exit`;
                        let payload = { eventName, windowWidth, breakpoint, classTarget: this.config.classTarget };
                        self.trigger(eventName, payload);
                    }
                }
            });

            newTargetJsmqClassList.forEach(bp => {
                for (let breakpointName in self.breakpoints) {
                    let breakpoint = self.breakpoints[breakpointName];
                    if (breakpoint.className === bp) {
                        let eventName = `${breakpointName}:enter`;
                        let payload = { eventName, windowWidth, breakpoint, classTarget: this.config.classTarget };
                        self.trigger(eventName, payload);
                    }
                }
            });


        }.bind(self), this.config.throttle);

        if (this.config.autoAttach) window.addEventListener('resize', this.changeHandler);

    }

    setBreakpoint(name, minWidth = 0, maxWidth = 100000, className = undefined) {
        maxWidth = parseInt(`${maxWidth}`.replace('*', '10000'), 10);
        if (!className) className = name;
        this.breakpoints[name] = { name, minWidth, maxWidth, className };
        this.changeHandler();
    }

    static detect(attrib = 'data-jsmq') {
        let elems = Array.prototype.slice.call(document.querySelectorAll(`[${attrib}]`));

        let rex = /\s*(\d+)\s*-\s*(\d+|\*)\s*:\s*(.*)\s*.*/gi;
        elems.forEach(elem => {
            let def = elem.getAttribute(attrib).split(',');
            let i = new JSMQ({ classTarget: elem, autoAttach: true });
            def.forEach(cdef => {
                let match = rex.exec(cdef); rex.test();
                if (Array.isArray(match) && match.length === 4) {
                    i.setBreakpoint(match[3], match[1], match[2], match[3]);
                }
            });
            elem.removeAttribute(attrib);
        });
    }
}

module.exports = JSMQ;

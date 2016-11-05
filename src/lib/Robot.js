const dom = require('./DOMUtils');

class Robot {
    constructor (opts) {
        Object.assign(this, {
            speed: 80
        }, opts);

        if (!this.target) {
            throw new Error('The robot needs a target!');
        } else {
            this.rootTarget = this.target;
            this.pushTarget(this.target);
            delete this.target;
        }
    }

    get targetEl () {
        return (this._targets = this._targets || [])[0];
    }

    popTarget () {
        (this._targets = this._targets || []).shift();
        if (this._targets.length == 0) {
            this._targets.push(this.rootTarget);
        }
    }

    pushTarget (target) {
        (this._targets = this._targets || []).unshift(target);
    }

    process (instructions = []) {
        var me = this;

        if (!Array.isArray(instructions)) {
            instructions = [instructions];
        }

        me.instructions = (instructions || []).slice();
        me.processing = new Date().getTime();
        me.cancel = false;

        /*
        function next(cb) {
            var instruction = me.instructions.shift();
            if (instruction) {
                me.promise.then(() => {
                    me[instruction['action']](instruction, () => next(cb));
                    dom.scrollToBottom(me.targetEl);
                });
            } else {
                me.processing = false;
                cb();
            }
        }*/

        Promise.all([me.promise || new Promise(() => {})].concat(me.instructions.map(me.processInstruction.bind(this)))).then(() => {
            me.processing = false;
        });
    }

    processInstruction (instruction) {
        let me = this;
        return me[instruction['action']](instruction).then(() => {
            dom.scrollToBottom(me.targetEl);
        });
    }

    prompt (instruction) {
        var me = this;
        return new Promise((resolve) => {
            var showPrompt = instruction.showPrompt || true;
            var newLine = instruction.newLine || true;
            me.cursor(false);
            me.popTarget();
            var line = dom.create(`div${newLine ? '.line' : ''}${showPrompt ? '.with-prompt' : ''}`);
            dom.appendElTo(me.targetEl, line);
            me.pushTarget(line);
            return me.cursor(true).then(resolve);
        });
    }


    cursor (instruction) {
        var me = this;
        return new Promise((resolve) => {
            if (instruction === true || instruction === false) {
                instruction = {
                    show: instruction
                }
            }
            if ('show' in instruction && instruction.show === true) {
                dom.appendElTo(me.targetEl, dom.create('span.cursor', '█'));
            } else {
                dom.removeChild(me.targetEl, '.cursor');
            }
            return resolve();
        });
    }

    cls (instruction, done) {
        var me = this;
        dom.update(me.targetEl, '');
        if (done) {
            done();
        }
    }

    return(instruction, done) {
        /*var me = this;
        me.cliEl.innerHTML = me.cliEl.innerHTML.slice(0, -(instruction[1] + 1));
        if (done) {
            done();
        }*/
        throw new Error('not yet implemented');
    }

    send (instruction) {
        var me = this;
        return new Promise((resolve) => {
            let text = instruction.text;
            me.cursor(false);
            dom.update(me.targetEl, text);
            return resolve();
        });
    }

    sleep(instruction, done) {
        var me = this;
        me.wait = instruction[1] || 500;
        setTimeout(function () {
            me.wait = 0;
            if (done) {
                done();
            }
        }, me.wait);
    }

    standby(clearScript) {
        this.cancel = true;
        this.processing = false;
        if (clearScript) {
            this.script = this._script = [];
        }
    }

    type (instruction) {
        var me = this;
        return new Promise((resolve) => {
            var text = instruction.text || '';
            var remainder = text.split('');
            var script = me.processing;

            function go() {
                if (remainder[0] === '\n') {
                    return me.prompt({});
                }
                var deviation = me.speed * (Math.random());
                me.wait = deviation;
                setTimeout(function () {
                    me.wait = 0;
                    var out = remainder.splice(0, 1);
                    if (me.cancel === true || me.processing !== script) {
                        return;
                    }
                    me.cursor(false);
                    dom.appendTo(me.targetEl, `${out}`);
                    me.cursor(true);
                    if (remainder.length == 0) {
                        return resolve();
                    } else if (me.cancel === false) {
                        go();
                    }
                }, deviation);
            }

            if (me.cancel === false) {
                go();
            }
        });
    }
}

module.exports = Robot;
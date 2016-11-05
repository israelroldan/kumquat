const dom = require('./lib/DOMUtils');
const KSParser = require('./lib/KSParser');
const Robot = require('./lib/Robot');
const Utils = require('./lib/Utils');

class kumquat {
    static create (opts) {
        let instance = new kumquat(opts);
        instance.render();
        return instance;
    }

    static init (parentNode = 'body') {
        parentNode = dom.toEl(parentNode);

        parentNode.querySelectorAll('.kumquat-terminal').forEach(kumquat._from);
    }

    static _from (node) {
        let dataset = node.dataset;
        let cfg = {
            renderTo: node
        };

        if (dataset.kumquatTitle) {
            cfg.title = dataset.kumquatTitle;
        }

        if (dataset.kumquatCode) {
            cfg.code = dataset.kumquatCode === 'false' ? false : dataset.kumquatCode;
        }

        if (dataset.kumquatCodeSrc) {
            cfg.codeSrc = dataset.kumquatCodeSrc;
        }

        if (dataset.kumquatScriptSrc) {
            cfg.scriptSrc = dataset.kumquatScriptSrc;
        }

        kumquat.create(cfg);
    }

    // -------------------------------------

    constructor (cfg) {
        this.config = Object.assign({}, {
            code: '',
            theme: 'default',
            renderTo: 'body'
        }, cfg);
    }

    set title (title) {
        if (title) {
            this._title = title;
            this._ktTitleEl.innerHTML = this._title;
        }
    }

    get title () {
        return this._title;
    }

    get robot () {
        if (!this._robot) {
            this._robot = new Robot({
                target: this._ktCliEl
            });
        }
        return this._robot;
    }

    render () {
        let me = this;
        let cfg = me.config;

        cfg.renderToEl = dom.toEl(cfg.renderTo);

        if (!cfg.renderToEl) {
            throw Error(`Selector ${cfg.renderTo} is not valid.`);
        }


        if (cfg.renderToEl === document.body || !dom.hasCls(cfg.renderToEl, 'kumquat-terminal')) {
            me._ktEl = dom.create(`${cfg.id ? '#' + cfg.id : ''}.kumquat-terminal`)
            dom.appendElTo(cfg.renderToEl, me._ktEl);
        } else {
            me._ktEl = cfg.renderToEl;
        }

        let domState = dom.survey(me._ktEl, `(.header>.btn.green+.btn.yellow+.btn.red+.title)+(.terminal>(.cli>.line>span.cursor)+.code)`);
        dom.appendElTo(me._ktEl,
            dom.appendElTo((domState['.header'].el || dom.create('.header')),
                (domState['.btn.red'].el || dom.create('.btn.red')),
                (domState['.btn.yellow'].el || dom.create('.btn.yellow')),
                (domState['.btn.green'].el || dom.create('.btn.green')),
                (domState['.title'].el || dom.create('.title', cfg.title))
            ),
            dom.appendElTo((domState['.terminal'].el || dom.create('.terminal')),
                (domState['.cli'].el || dom.create('.cli')),
                (domState['.code'].el || dom.create('.code'))
            )
        );

        me._ktTitleEl = me._ktEl.querySelector('.header > .title');
        me._ktCliEl = me._ktEl.querySelector('.terminal > .cli');
        me._ktCodeEl = me._ktEl.querySelector('.terminal > .code');

        me.title = cfg.title;

        if (cfg.code === false) {
            dom.addCls(me._ktCodeEl, 'hidden');
        } else {
            dom.update(me._ktCodeEl, cfg.code)
        }

        if (cfg.codeSrc) {
            Utils.loadFileContents(cfg.codeSrc, (contents) => {
                dom.update(me._ktCodeEl, `<pre><code>${contents}</code></pre>`);
            });
        }

        if (cfg.scriptSrc) {
            Utils.loadFileContents(cfg.scriptSrc, (contents) => {
                me.robot.process(KSParser.parse(contents));
            });
        }

        me.robot.process([{
            action: 'prompt'
        }]);
    }

    code (contents = '') {
        this._ktCodeEl.innerHTML = contents;
    }

    type (line) {
        this.robot.process({
            text: line,
            action: 'type'
        });
    }

    process (conf = {}) {

    }
}

module.exports = global.kumquat = kumquat;
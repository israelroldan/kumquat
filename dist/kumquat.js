(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dom = require('./lib/DOMUtils');
var KSParser = require('./lib/KSParser');
var Robot = require('./lib/Robot');
var Utils = require('./lib/Utils');

var kumquat = function () {
    _createClass(kumquat, null, [{
        key: 'create',
        value: function create(opts) {
            var instance = new kumquat(opts);
            instance.render();
            return instance;
        }
    }, {
        key: 'init',
        value: function init() {
            var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';

            parentNode = dom.toEl(parentNode);

            parentNode.querySelectorAll('.kumquat-terminal').forEach(kumquat._from);
        }
    }, {
        key: '_from',
        value: function _from(node) {
            var dataset = node.dataset;
            var cfg = {
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

    }]);

    function kumquat(cfg) {
        _classCallCheck(this, kumquat);

        this.config = Object.assign({}, {
            code: '',
            theme: 'default',
            renderTo: 'body'
        }, cfg);
    }

    _createClass(kumquat, [{
        key: 'render',
        value: function render() {
            var me = this;
            var cfg = me.config;

            cfg.renderToEl = dom.toEl(cfg.renderTo);

            if (!cfg.renderToEl) {
                throw Error('Selector ' + cfg.renderTo + ' is not valid.');
            }

            if (cfg.renderToEl === document.body || !dom.hasCls(cfg.renderToEl, 'kumquat-terminal')) {
                me._ktEl = dom.create((cfg.id ? '#' + cfg.id : '') + '.kumquat-terminal');
                dom.appendElTo(cfg.renderToEl, me._ktEl);
            } else {
                me._ktEl = cfg.renderToEl;
            }

            var domState = dom.survey(me._ktEl, '(.header>.btn.green+.btn.yellow+.btn.red+.title)+(.terminal>(.cli>.line>span.cursor)+.code)');
            dom.appendElTo(me._ktEl, dom.appendElTo(domState['.header'].el || dom.create('.header'), domState['.btn.red'].el || dom.create('.btn.red'), domState['.btn.yellow'].el || dom.create('.btn.yellow'), domState['.btn.green'].el || dom.create('.btn.green'), domState['.title'].el || dom.create('.title', cfg.title)), dom.appendElTo(domState['.terminal'].el || dom.create('.terminal'), domState['.cli'].el || dom.create('.cli'), domState['.code'].el || dom.create('.code')));

            me._ktTitleEl = me._ktEl.querySelector('.header > .title');
            me._ktCliEl = me._ktEl.querySelector('.terminal > .cli');
            me._ktCodeEl = me._ktEl.querySelector('.terminal > .code');

            me.title = cfg.title;

            if (cfg.code === false) {
                dom.addCls(me._ktCodeEl, 'hidden');
            } else {
                dom.update(me._ktCodeEl, cfg.code);
            }

            if (cfg.codeSrc) {
                Utils.loadFileContents(cfg.codeSrc, function (contents) {
                    dom.update(me._ktCodeEl, '<pre><code>' + contents + '</code></pre>');
                });
            }

            if (cfg.scriptSrc) {
                Utils.loadFileContents(cfg.scriptSrc, function (contents) {
                    me.robot.process(KSParser.parse(contents));
                });
            }

            me.robot.process([{
                action: 'prompt'
            }]);
        }
    }, {
        key: 'code',
        value: function code() {
            var contents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            this._ktCodeEl.innerHTML = contents;
        }
    }, {
        key: 'type',
        value: function type(line) {
            this.robot.process({
                text: line,
                action: 'type'
            });
        }
    }, {
        key: 'process',
        value: function process() {
            var conf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        }
    }, {
        key: 'title',
        set: function set(title) {
            if (title) {
                this._title = title;
                this._ktTitleEl.innerHTML = this._title;
            }
        },
        get: function get() {
            return this._title;
        }
    }, {
        key: 'robot',
        get: function get() {
            if (!this._robot) {
                this._robot = new Robot({
                    target: this._ktCliEl
                });
            }
            return this._robot;
        }
    }]);

    return kumquat;
}();

module.exports = global.kumquat = kumquat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/DOMUtils":2,"./lib/KSParser":3,"./lib/Robot":4,"./lib/Utils":5}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _parse = function _parse(selector) {
    var obj = { tag: '', classes: [], id: '' };
    selector.split(/(?=\.)|(?=#)/).forEach(function (token) {
        switch (token[0]) {
            case '#':
                if (!obj.id) {
                    obj.id = token.slice(1);
                }
                break;
            case '.':
                obj.classes.push(token.slice(1));
                break;
            default:
                if (!obj.tag) {
                    obj.tag = token;
                }
                break;
        }
    });
    return obj;
};

var DOMUtils = function () {
    function DOMUtils() {
        _classCallCheck(this, DOMUtils);
    }

    _createClass(DOMUtils, null, [{
        key: 'create',
        value: function create() {
            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
            var innerHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var def = _parse(selector);
            var el = document.createElement(def.tag || 'div');
            el.innerHTML = innerHTML;
            if (def.id) {
                el.setAttribute('id', def.id);
            }
            if (def.classes.length > 0) {
                DOMUtils.addCls.apply(DOMUtils, [el].concat(_toConsumableArray(def.classes)));
            }
            return el;
        }
    }, {
        key: 'addCls',
        value: function addCls(el) {
            for (var _len = arguments.length, cls = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                cls[_key - 1] = arguments[_key];
            }

            cls.forEach(function (c) {
                return el.classList.add(c);
            });
            return el;
        }
    }, {
        key: 'hasCls',
        value: function hasCls(el, cls) {
            return el.classList.contains(cls);
        }
    }, {
        key: 'appendElTo',
        value: function appendElTo(el) {
            for (var _len2 = arguments.length, child = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                child[_key2 - 1] = arguments[_key2];
            }

            child.forEach(function (c) {
                return el.appendChild(c);
            });
            return el;
        }
    }, {
        key: 'update',
        value: function update(el, html) {
            el.innerHTML = html;
            return el;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(el, html) {
            el.innerHTML += html;
            return el;
        }
    }, {
        key: 'replaceIn',
        value: function replaceIn(el, search, replace) {
            return DOMUtils.update(el, el.innerHTML.replace(search, replace));
        }
    }, {
        key: 'removeChild',
        value: function removeChild(el, childSelector) {
            var child = DOMUtils.getChild(el, childSelector);
            if (child) {
                child.parentNode.removeChild(child);
                child = null;
            }
            return el;
        }
    }, {
        key: 'getChild',
        value: function getChild(el, childSelector) {
            return el.querySelector(childSelector);
        }
    }, {
        key: 'isEl',
        value: function isEl(obj) {
            try {
                return obj instanceof HTMLElement;
            } catch (e) {
                return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj.nodeType === 1 && _typeof(obj.style) === "object" && _typeof(obj.ownerDocument) === "object";
            }
        }
    }, {
        key: 'toEl',
        value: function toEl(strOrEl) {
            if (strOrEl instanceof String || typeof strOrEl === 'string') {
                return document.querySelector(strOrEl);
            } else if (DOMUtils.isEl(strOrEl)) {
                return strOrEl;
            }
        }
    }, {
        key: 'scrollToBottom',
        value: function scrollToBottom(el) {
            el.scrollTop = el.scrollHeight;
            return el;
        }
    }, {
        key: 'survey',
        value: function survey(el, template) {
            var isDelimiter = function isDelimiter(c) {
                return ['>', '(', ')', '+'].indexOf(c) > -1;
            }; // Whether `c` is an 'end-of-token' character
            var selector = null; // A selector
            var selectors = []; // The selectors in the template string
            var depth = 0; // 0 means 'root', each +1 means child of the previous, each -1 means sibling of the parent, same means sibling

            template.split('').forEach(function (char) {
                if (selector !== null) {
                    if (isDelimiter(char)) {
                        selectors.push({
                            token: selector,
                            depth: depth
                        });
                        switch (char) {
                            case '>':
                            case '(':
                                depth++;
                                break;
                            case ')':
                                depth -= 2;
                                break;
                        }
                    }
                    selector = isDelimiter(char) ? null : selector + char;
                } else if (!isDelimiter(char)) {
                    selector = char;
                } else {
                    switch (char) {
                        case '>':
                        case '(':
                            depth++;
                            break;
                        case ')':
                            depth -= 2;
                            break;
                    }
                }
            });
            if (selector !== null) {
                selectors.push({
                    token: selector,
                    depth: depth
                });
                selector = null;
            }

            var target = void 0;
            var lastObj = {
                el: el,
                depth: -1
            };
            var report = {};
            selectors.forEach(function (selObj) {
                if (selObj.depth > lastObj.depth) {
                    target = lastObj.el;
                } else if (selObj.depth < lastObj.depth) {
                    target = lastObj.parent.parentNode;
                } else if (lastObj.el == null && selObj.depth == lastObj.depth) {
                    target = lastObj.parent;
                }
                if (target !== null) {
                    var candidates = target.querySelectorAll(selObj.token.replace(/{.*}/g, ''));
                    if (candidates.length == 0) {
                        selObj.el = null;
                    } else {
                        for (var i = 1; i < candidates.length; i++) {
                            candidates[i].parentNode.removeChild(candidates[i]);
                        }
                        selObj.el = candidates[0];
                    }
                    selObj.parent = target;
                    lastObj = selObj;
                } else {
                    selObj.el = null;
                }
                var token = selObj.token;
                report[token.replace(/{.*}/g, '')] = {
                    el: selObj.el,
                    parent: selObj.parent,
                    expression: selObj.token
                };
            });
            return report;
        }
    }]);

    return DOMUtils;
}();

module.exports = DOMUtils;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KSParser = function () {
    _createClass(KSParser, null, [{
        key: 'parse',
        value: function parse(script) {
            return new KSParser().parseScript(script);
        }

        // ------------------------

    }]);

    function KSParser() {
        _classCallCheck(this, KSParser);

        this.elements = [];
    }

    _createClass(KSParser, [{
        key: 'parseLine',
        value: function parseLine(line) {
            switch (line[0]) {
                case '#':
                    // ignore comments
                    return;
                case '>':
                    this._startType(line);
                    break;
                case '<':
                    this._startSend(line);
                    break;
                case '!':
                    if (line[1] == '<') {
                        this._startGroupSend(line);
                    }
                    break;
                default:
                    // ignore invalid lines;
                    return;
            }
        }
    }, {
        key: 'parseScript',
        value: function parseScript(script) {
            script.split('\n').forEach(this.parseLine.bind(this));
            return this._build();
        }
    }, {
        key: '_build',
        value: function _build() {
            return this.elements;
        }
    }, {
        key: '_startSend',
        value: function _startSend(line) {
            var text = '';

            text = line.slice(1).trim();

            text += '\n';
            this.elements.push({
                action: 'send',
                text: text
            });
        }
    }, {
        key: '_startType',
        value: function _startType(line) {
            var text = '';

            text = line.slice(1).trim();

            text += '\n';
            this.elements.push({
                action: 'type',
                text: text
            });
        }
    }]);

    return KSParser;
}();

module.exports = KSParser;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dom = require('./DOMUtils');

var Robot = function () {
    function Robot(opts) {
        _classCallCheck(this, Robot);

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

    _createClass(Robot, [{
        key: 'popTarget',
        value: function popTarget() {
            (this._targets = this._targets || []).shift();
            if (this._targets.length == 0) {
                this._targets.push(this.rootTarget);
            }
        }
    }, {
        key: 'pushTarget',
        value: function pushTarget(target) {
            (this._targets = this._targets || []).unshift(target);
        }
    }, {
        key: 'process',
        value: function process() {
            var instructions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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

            Promise.all([me.promise || new Promise(function () {})].concat(me.instructions.map(me.processInstruction.bind(this)))).then(function () {
                me.processing = false;
            });
        }
    }, {
        key: 'processInstruction',
        value: function processInstruction(instruction) {
            var me = this;
            return me[instruction['action']](instruction).then(function () {
                dom.scrollToBottom(me.targetEl);
            });
        }
    }, {
        key: 'prompt',
        value: function prompt(instruction) {
            var me = this;
            return new Promise(function (resolve) {
                var showPrompt = instruction.showPrompt || true;
                var newLine = instruction.newLine || true;
                me.cursor(false);
                me.popTarget();
                var line = dom.create('div' + (newLine ? '.line' : '') + (showPrompt ? '.with-prompt' : ''));
                dom.appendElTo(me.targetEl, line);
                me.pushTarget(line);
                return me.cursor(true).then(resolve);
            });
        }
    }, {
        key: 'cursor',
        value: function cursor(instruction) {
            var me = this;
            return new Promise(function (resolve) {
                if (instruction === true || instruction === false) {
                    instruction = {
                        show: instruction
                    };
                }
                if ('show' in instruction && instruction.show === true) {
                    dom.appendElTo(me.targetEl, dom.create('span.cursor', '█'));
                } else {
                    dom.removeChild(me.targetEl, '.cursor');
                }
                return resolve();
            });
        }
    }, {
        key: 'cls',
        value: function cls(instruction, done) {
            var me = this;
            dom.update(me.targetEl, '');
            if (done) {
                done();
            }
        }
    }, {
        key: 'return',
        value: function _return(instruction, done) {
            /*var me = this;
            me.cliEl.innerHTML = me.cliEl.innerHTML.slice(0, -(instruction[1] + 1));
            if (done) {
                done();
            }*/
            throw new Error('not yet implemented');
        }
    }, {
        key: 'send',
        value: function send(instruction) {
            var me = this;
            return new Promise(function (resolve) {
                var text = instruction.text;
                me.cursor(false);
                dom.update(me.targetEl, text);
                return resolve();
            });
        }
    }, {
        key: 'sleep',
        value: function sleep(instruction, done) {
            var me = this;
            me.wait = instruction[1] || 500;
            setTimeout(function () {
                me.wait = 0;
                if (done) {
                    done();
                }
            }, me.wait);
        }
    }, {
        key: 'standby',
        value: function standby(clearScript) {
            this.cancel = true;
            this.processing = false;
            if (clearScript) {
                this.script = this._script = [];
            }
        }
    }, {
        key: 'type',
        value: function type(instruction) {
            var me = this;
            return new Promise(function (resolve) {
                var text = instruction.text || '';
                var remainder = text.split('');
                var script = me.processing;

                function go() {
                    if (remainder[0] === '\n') {
                        return me.prompt({});
                    }
                    var deviation = me.speed * Math.random();
                    me.wait = deviation;
                    setTimeout(function () {
                        me.wait = 0;
                        var out = remainder.splice(0, 1);
                        if (me.cancel === true || me.processing !== script) {
                            return;
                        }
                        me.cursor(false);
                        dom.appendTo(me.targetEl, '' + out);
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
    }, {
        key: 'targetEl',
        get: function get() {
            return (this._targets = this._targets || [])[0];
        }
    }]);

    return Robot;
}();

module.exports = Robot;

},{"./DOMUtils":2}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'loadFileContents',
        value: function loadFileContents(path, callback) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4 && httpRequest.status === 200 && callback) {
                    callback(httpRequest.responseText);
                }
            };
            httpRequest.open('GET', path);
            httpRequest.send();
        }
    }]);

    return Utils;
}();

module.exports = Utils;

},{}]},{},[1])


//# sourceMappingURL=kumquat.js.map

let _parse = (selector) => {
    var obj = {tag:'', classes:[], id: ''};
    selector.split(/(?=\.)|(?=#)/).forEach((token) =>{
        switch (token[0]) {
            case '#':
                if (!obj.id) {
                    obj.id = token.slice(1);
                }
                break;
            case '.':
                obj.classes.push(token.slice(1));
                break;
            default :
                if (!obj.tag) {
                    obj.tag = token;
                }
                break;
        }
    });
    return obj;
};

class DOMUtils {
    static create (selector = 'div', innerHTML = '') {
        let def = _parse(selector);
        let el = document.createElement(def.tag || 'div');
        el.innerHTML = innerHTML;
        if (def.id) {
            el.setAttribute('id', def.id);
        }
        if (def.classes.length > 0) {
            DOMUtils.addCls(el, ...def.classes);
        }
        return el;
    }

    static addCls (el, ...cls) {
        cls.forEach((c) => el.classList.add(c));
        return el;
    }

    static hasCls (el, cls) {
        return el.classList.contains(cls);
    }

    static appendElTo (el, ...child) {
        child.forEach((c) => el.appendChild(c));
        return el;
    }

    static update (el, html) {
        el.innerHTML = html;
        return el;
    }

    static appendTo (el, html) {
        el.innerHTML += html;
        return el;
    }

    static replaceIn (el, search, replace) {
        return DOMUtils.update(el, el.innerHTML.replace(search, replace));
    }

    static removeChild (el, childSelector) {
        var child = DOMUtils.getChild(el, childSelector);
        if (child) {
            child.parentNode.removeChild(child);
            child = null;
        }
        return el;
    }

    static getChild (el, childSelector) {
        return el.querySelector(childSelector)
    }

    static isEl (obj) {
        try {
            return (obj instanceof HTMLElement);
        } catch (e) {
            return ((typeof obj === "object") &&
                (obj.nodeType === 1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument === "object"));
        }
    }

    static toEl (strOrEl) {
        if (strOrEl instanceof String || typeof strOrEl === 'string') {
            return document.querySelector(strOrEl);
        } else if (DOMUtils.isEl(strOrEl)) {
            return strOrEl;
        }
    }

    static scrollToBottom (el) {
        el.scrollTop = el.scrollHeight;
        return el;
    }

    static survey (el, template) {
        let isDelimiter = (c) => ['>','(',')','+'].indexOf(c) > -1; // Whether `c` is an 'end-of-token' character
        let selector = null;   // A selector
        let selectors = [];  // The selectors in the template string
        let depth = 0; // 0 means 'root', each +1 means child of the previous, each -1 means sibling of the parent, same means sibling

        template.split('').forEach((char) => {
            if (selector !== null) {
                if (isDelimiter(char)) {
                    selectors.push({
                        token: selector,
                        depth
                    });
                    switch (char) {
                        case '>':
                        case '(':
                            depth++;
                            break;
                        case ')':
                            depth-=2;
                            break;
                    }
                }
                selector = (isDelimiter(char) ? null : selector + char);
            } else if (!isDelimiter(char)) {
                selector = char;
            } else {
                switch (char) {
                    case '>':
                    case '(':
                        depth ++;
                        break;
                    case ')':
                        depth-=2;
                        break;
                }
            }
        });
        if (selector !== null) {
            selectors.push({
                token: selector,
                depth
            });
            selector = null;
        }

        let target;
        let lastObj = {
            el: el,
            depth: -1
        };
        let report = {};
        selectors.forEach((selObj) => {
            if (selObj.depth > lastObj.depth) {
                target = lastObj.el;
            } else if (selObj.depth < lastObj.depth) {
                target = lastObj.parent.parentNode;
            } else if (lastObj.el == null && selObj.depth == lastObj.depth) {
                target = lastObj.parent;
            }
            if (target !== null) {
                let candidates = target.querySelectorAll(selObj.token.replace(/{.*}/g,''));
                if (candidates.length == 0) {
                    selObj.el = null;
                } else {
                    for (let i = 1; i < candidates.length; i++) {
                        candidates[i].parentNode.removeChild(candidates[i]);
                    }
                    selObj.el = candidates[0];
                }
                selObj.parent = target;
                lastObj = selObj;
            } else {
                selObj.el = null;
            }
            let token = selObj.token;
            report[token.replace(/{.*}/g,'')] = {
                el: selObj.el,
                parent: selObj.parent,
                expression: selObj.token
            };
        });
        return report;
    }
}

module.exports = DOMUtils;
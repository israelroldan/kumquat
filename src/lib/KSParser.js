class KSParser {
    static parse (script) {
        return new KSParser().parseScript(script);
    }

    // ------------------------

    constructor () {
        this.elements = [];
    }

    parseLine (line) {
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

    parseScript (script) {
        script.split('\n').forEach(this.parseLine.bind(this));
        return this._build();
    }

    _build () {
        return this.elements;
    }

    _startSend (line) {
        let text = '';

        text = line.slice(1).trim();

        text += '\n';
        this.elements.push({
            action: 'send',
            text
        });
    }

    _startType (line) {
        let text = '';

        text = line.slice(1).trim();

        text += '\n';
        this.elements.push({
            action: 'type',
            text
        });
    }

}

module.exports = KSParser;
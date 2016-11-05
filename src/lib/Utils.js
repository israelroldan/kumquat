class Utils {
    static loadFileContents (path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4 && httpRequest.status === 200 && callback) {
                callback(httpRequest.responseText);
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }
}

module.exports = Utils;
![kumquat screenshot](assets/screenshot.png)

# kumquat 🍊 
A web showcase for your terminal apps 

## Getting Started

**Install**

Install using your package manager of choice:

    $ bower install kumquat --save
        or 
    $ npm install kumquat --save
        or 
    $ yarn add kumquat
        
**Include in your project**

Include `dist/kumquat.js` and `dist/kumquat.css`

    <link rel="stylesheet" href="bower_components/kumquat/dist/kumquat.css">
    <script src="bower_component/kumquat/dist/kumquat.js">
        or
    <link rel="stylesheet" href="node_modules/kumquat/dist/kumquat.css">
    <script src="node_modules/kumquat/dist/kumquat.js">

**Configure an instance**

Use `kumquat.create` to create a new instance, use 'renderTo' to specify the parent element.

    <script>
        var shwocase = kumquat.create({
            title: 'my-awesome-cli',
            renderTo: document.body
        });
    </script>
    
Open your browser, you'll be greeted by your kumquat instance:

![kumquat screenshot](assets/screenshot_2.png)

**Change its contents using the programmatic API**

For example:

    <script>
        showcase.code('This is an example');
        showcase.type('npm install my-awesome-cli');
    </script>

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct, and the
process for submitting pull requests.

## Versioning

`kumquat` uses [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/israelroldan/kumquat/tags). 


## Authors

- **Israel Roldan** - Author [israelroldan](https://github.com/israelroldan)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
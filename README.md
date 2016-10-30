![kumquat screenshot](assets/screenshot.png)

# kumquat 🍊 
A web showcase for your terminal apps 

## Getting Started

**Quick start using bower**

1. Install using bower

        bower install kumquat
    
2. Create `kumquat-example.html`:
        
        <html>
        <head>
            <title>kumquat example</title>
            <link rel="stylesheet" href="bower-components/kumquat/dist/kumquat.css">
        </head>
        <body>
            <div class="kumquat-terminal">
                <header>
                    <div class="btn green"></div>
                    <div class="btn yellow"></div>
                    <div class="btn red"></div>
                    <div class="title">kumquat example</div>
                </header>
                <section class="terminal">
                    <div class="cli">
                        <div class="line">type<span class="cursor">_</span></div>
                    </div>
                </section>
            </div>
        </body>
        </html>
        
3. Open `kumquat-example.html` in your browser (no server required!).

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
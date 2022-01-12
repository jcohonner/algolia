
const fs = require('fs');
const Handlebars = require("handlebars");

module.exports = class Generator {

    constructor(className) {
        this.className = className;

    }

    async generate() {
        console.log("Generating class " + this.className);
        const template = Handlebars.compile(fs.readFileSync(__dirname + '/../templates/classModule.hbs', 'utf-8'));
        const code = template({ className: this.className });
        fs.writeFileSync('./' + this.className + '.js', code, 'utf-8');
    }

}
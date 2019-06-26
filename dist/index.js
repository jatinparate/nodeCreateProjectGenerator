#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk_1 = require("chalk");
const ejs = require("ejs");
const CHOISES = fs.readdirSync(path.join(__dirname, '../src/templates'));
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOISES
    },
    {
        name: 'name',
        type: 'input',
        message: 'Project name: '
    }
];
function render(content, data) {
    return ejs.render(content, data);
}
exports.render = render;
const CURR_DIR = process.cwd();
inquirer.prompt(QUESTIONS)
    .then(answers => {
    const projectChoice = answers['template'];
    const projectName = answers['name'];
    const templatePath = path.join(__dirname, '../src/templates', projectChoice);
    const targetPath = path.join(CURR_DIR, projectName);
    if (!createProject(targetPath)) {
        return;
    }
    createDirectoryContents(templatePath, projectName);
});
function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk_1.default.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
}
const SKIP_FILES = ['node_modules', '.template.json'];
function createDirectoryContents(templatePath, projectName) {
    //read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
        4;
        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1)
            return;
        if (stats.isFile()) {
            //read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = render(contents, { projectName });
            //write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}
//# sourceMappingURL=index.js.map
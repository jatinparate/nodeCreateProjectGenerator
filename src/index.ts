#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as ejs from 'ejs';

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

export interface CliOptions {
    projectName: string,
    templateName: string,
    templatePath: string,
    targetPath: string
}

export interface TemplateData {
    projectName: string
}

export function render(content: string, data: TemplateData) {
    return ejs.render(content, data);
}

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS)
    .then(answers => {
        const projectChoice = answers['template'];
        const projectName = answers['name'];

        const templatePath = path.join(__dirname, '../src/templates', projectChoice);
        const targetPath = path.join(CURR_DIR, projectName);

        if(!createProject(targetPath)) {
            return;
        }

        createDirectoryContents(templatePath, projectName);
    });

function createProject(projectPath: string) {
    if(fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }

    fs.mkdirSync(projectPath);

    return true;
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath: string, projectName: string) {
    //read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);

    // loop each file/folder
    filesToCreate.forEach(file=>{
        const origFilePath = path.join(templatePath, file);
        
        // get stats about the current file
        const stats = fs.statSync(origFilePath);4
        
        // skip files that should not be copied
        if(SKIP_FILES.indexOf(file) > -1) return;

        if(stats.isFile()) {
            //read file content and transform it using template engine

            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = render(contents, {projectName});

            //write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);

            fs.writeFileSync(writePath, contents, 'utf8');
        } else if(stats.isDirectory()) {
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}
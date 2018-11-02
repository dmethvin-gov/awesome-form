/**
 * This script completes the installation of the starter app.
 * It runs at the end of the `npm install` to set things up.
 */

 // TODO: Need an escape for people who want to install but not adapt

const { mv, rm, which, exec } = require("shelljs");
const chalk = require("chalk");
const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const { fork } = require("child_process");

const actions = {
  needs: [
    "git"
  ],
  delete: [
    ".git",
    ".gitattributes",
    "tools/init.ts"
  ],
  edit: [
    "LICENSE",
    "package.json",
    "webpack.config.ts",
    "test/library.test.ts",
  ]
};

const abspath = file => path.resolve(__dirname, "..", file));
const phase = p => console.log(chalk.cyan(p));

const postinstall = process.argv[0];
const project = process.argv[1];

console.log(chalk.blue("${postinstall}: Completing installation:"));

if ( !project ) {
  console.error(chalk.red(`Usage: ${postinstall} projectName`));
  process.exit(1);
}

actions.needs.forEach(cmd => {
  if ( !which(cmd) ) {
    console.error(chalk.red(`${postinstall} error: ${cmd} is required but can't be found`));
    process.exit(0);
  }
});

let username = exec("git config user.name").stdout.trim();
let usermail = exec("git config user.email").stdout.trim();
if ( !username || !useremail ) {
  console.warn(chalk.yellow("Warning: git username and/or email are not set\n"));
}
const editvars = {
  username,
  useremail,
  project
};


phase("Setting up git hooks...");
fork(
  path.resolve(__dirname, "..", "node_modules", "husky", "bin", "install"),
  { silent: true }
);

phase("Removing files and dirs...");
rm("-rf", actions.delete.map(abspath));
console.log(colors.red("  " + actions.delete.join("\n  ")));


phase("Editing files...");
actions.edit.map(abspath).forEach(f => {
  const original = readFileSync(f, "utf-8");
  const edited = original.replace(
    /${([\w\-]+)}/g,
    (_, name) => editvars[name.toLowerCase()]
  );
  writeFileSync(edited);
});

phase("Initializing git...");
exec('git init "' + path.resolve(__dirname, "..") + '"');


phase("Removing postinstall script from package.json ...")
const pkg = JSON.parse(readFileSync(abspath("package.json")));
delete pkg.scripts.postinstall


console.log("\nDone!\n");

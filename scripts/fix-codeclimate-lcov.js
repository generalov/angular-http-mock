/*eslint-env node */
/*eslint-disable no-console */

const readline = require('readline');
const projectRoot = require('path').dirname(__dirname);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

rl.on('line', function(line){
    console.log(line.replace(new RegExp(`^SF:(.*!)${escapeRegExp(projectRoot)}.`), 'SF:'));
})

/*eslint-env node*/
/*eslint-disable no-console */

const spawn = require('child_process').spawn;
const CODECLIMATE_CODE = require('path').dirname(__dirname);
const CODECLIMATE_TMP = isWin() ? `${__dirname[0]}:\\tmp\\cc` : '/tmp/cc';

const codeclimate = spawn(
  'docker',
  [
    'run', '--rm',
    ...(process.stdout.isTTY ? ['-it'] : []),
    '-e', `CODECLIMATE_CODE="${normPath(CODECLIMATE_CODE)}"`,
    '-e', `CODECLIMATE_TMP="${normPath(CODECLIMATE_TMP)}"`,
    '-v', `${CODECLIMATE_CODE}:/code`,
    '-v', `${CODECLIMATE_TMP}:/tmp/cc`,
    '-v', '/var/run/docker.sock:/var/run/docker.sock',
    'codeclimate/codeclimate', ...process.argv.slice(2)
  ],
  {shell: true, stdio: 'inherit'}
);

codeclimate.on('close', (code) => {
  process.exit(code);
});

function isWin() {
  return /^win/.test(process.platform);
}

function normPath(path) {
  return isWin() ? '/' + path.replace(/\\/g, '/').replace(':', '') : path;
}

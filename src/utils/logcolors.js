const chalk = require('chalk');

const logColors = Object.freeze({
  errorColorBG: chalk.bgRed,
  errorColor: chalk.red,
  successColorBG: chalk.black.bgGreen,
  successColor: chalk.green,
  warningColor: chalk.yellow
});

module.exports = logColors;
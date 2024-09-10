// Usamos la libreria Commander para que sea mas sencillo usar process
const { Command } = require('commander');

const program = new Command();

program
    .option('--mode <mode>', 'Modo de Trabajo de mi Server', 'production')
    .parse()

module.exports = program;
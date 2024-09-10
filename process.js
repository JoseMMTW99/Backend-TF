console.log(process);

console.log(process.cwd())
console.log(process.pid)
console.log(process.memoryUsage)
console.log(process.argv)
console.log(process.version)

// Usamos la libreria Commander para que sea mas sencillo usar process

const { Command } = require('commander');

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del Servidor', 8080)
    .option('--mode <mode>', 'Modo de Trabajo de mi Server', 'production')
    .option('-u <user>', 'Usuario usando el aplicativo', 'No se ha declarado user')
    .option('-l, --letters [leters...]', 'Specify letter')

// Seria lo mismo que poner arriba .parse() concatenado
program.parse()

console.log('Options: ', program.opts())
console.log('Options: ', program.args)


//  EJEMPLOS
//node process.js -d -p 3000 --mode development -u root --letters a s d
//node process.js -u root 2 a 5 --letters a s d


process.on('exit', code => {
    console.log('Antes de salir del proceso', code)
})

process.on('uncaughtException', exception => {
    console.log('Este atrapa los errores no encontrados y controlados (fuera de un try/catch)', exception)
})
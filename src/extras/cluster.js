// CLASE 35

const cluster = require('cluster');
const { cpus } = require('node:os');

console.log(cluster.isPrimary);
const numeroDeProcesadores = cpus().length;

console.log('Número de hilos: ', numeroDeProcesadores);

if (cluster.isPrimary) {
    console.log('Proceso primario, generando un proceso hijo...');
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork()
    }
    cluster.on('message', worker => {
        console.log(`Worker ${worker.process.pid} recibio un mensaje`)
    })
} else {
    console.log('Al ser un proceso forkeado, no cuento como primerio, por lo tanto "isPrimary" es falso, soy un worker');
    console.log(`Soy un proceso hijo con el ID: ${process.pid}`)
}
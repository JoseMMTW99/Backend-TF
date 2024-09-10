nvm install 20.15.1 (version de node instalada)
nvm use 20.15.1


Artillery
artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/simple" -o simple.json 
artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/compleja" -o compleja.json

artillery run config.yml --output testPerformance.json
artillery report testPerformance.json -o testResults.html



// COMANDO PARA EJECUTAR DOCKER

docker run -p 8000:8000 clases_backend


// COMANDO PARA EJECUTAR MINIKUBE (CON LA IMAGEN DE DOCKER)

minikube service kubeservice
let plants = [
  { id: 1, name: "Snake Plant", type: "Succulent", sunlight: "Low", watered: true },
  { id: 2, name: "Pothos", type: "Vine", sunlight: "Medium", watered: false },
  { id: 3, name: "Monstera", type: "Tropical", sunlight: "Medium", watered: true },
  { id: 4, name: "Cactus", type: "Succulent", sunlight: "High", watered: false },
];

let nextId = 5;
//-------------------------------------------------------------------------------------
const express = require('express');
const { Response } = require('undici-types');
const app = express();
const PORT = 8080;
app.use(express.json());


app.get('/api/plants', (request, response) =>{
    response.json(plants)
} )

app.get('/api/plants/:id', (request, response) =>{
    const plantId = Number(request.params.id);
    const plant = plants.find((target) => target.id === plantId)
    plant
    ? response.json(plant) 
    : response.status(404).send("Plant not found")
} )

app.post('/api/plants', (request, response) =>{
    const {name, type, sunlight} = request.body 
    const newPlant = {id: nextId, name, type, sunlight, watered: false }
    nextId++;
    plants.push(newPlant);
    response.status(201).json(newPlant);
} )

app.patch('/api/plants/:id', (request, response) =>{
    const plantId = Number(request.params.id)
    const plantToUpdate = plants.find((target) => target.id === plantId)
    plantToUpdate 
    ? Object.assign(plantToUpdate, request.body) 
    && response.json(plantToUpdate) 
    : response.status(404).send('Plant not found')
} )

app.delete('/api/plants/:id', (request, response) =>{
    const plantId = Number(request.params.id);
    plants = plants.filter((target) => { return target.id !== plantId});
    response.status(204).send(`Plant ${plantId} deleted`);

} )

app.listen(PORT, () => console.log('Server Running on port 8080') )
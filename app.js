let careNotes = [
  { id: 1, plantId: 1, note: "Needs water every 2 weeks." },
  { id: 2, plantId: 1, note: "Tolerates low light well." },
  { id: 3, plantId: 3, note: "Loves humidity." },
];

let nextNoteId = 4;
//--------------------------------------------------------------------------------------
let plants = [
  { id: 1, name: "Snake Plant", type: "Succulent", sunlight: "Low", watered: true },
  { id: 2, name: "Pothos", type: "Vine", sunlight: "Medium", watered: false },
  { id: 3, name: "Monstera", type: "Tropical", sunlight: "Medium", watered: true },
  { id: 4, name: "Cactus", type: "Succulent", sunlight: "High", watered: false },
];

let nextId = 5;
//-------------------------------------------------------------------------------------
const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());

function logReqMethodAndUrl (req, res, next){
    console.log(">>>>>>>>>", req.method, req.originalUrl);
    next();
}
app.use(logReqMethodAndUrl)

function postHasNameAndType (req, res, next){
   const {name, type} = req.body; 
   if (!(name && type)){
        res.status(400).send("POST requires name AND type")
   } 
    next();
}

//this is to retireve all plants
// app.get('/api/plants', (req, res) =>{
//     res.json(plants)
// } )

//req.query
//the query values are set to lowercase
//still need to find a way to accept one, the other, and both. Im thinking maybe middleware
app.get('/api/plants', (req, res) =>{
        const {type,sunlight} = req.query;
        const plantType = plants.filter(target => target.type.toLowerCase() === type);
        //const amountOfSunlight = plants.filter(amount => amount.sunlight.toLowerCase() === sunlight);
        type ? res.json(plantType) : res.json(plants);
} );

//I added this for convenience
app.get('/api/notes', (req, res) => {
    res.json(careNotes);
} );
app.get('/api/plants/:plantId/notes', (req, res, next) =>{
    try{
        const plantId = Number(req.params.plantId); //REMEMBER THIS!!! plantId from req.params is based off the URL not the property 
        const plantNote = careNotes.filter((target) => target.plantId === plantId);
        res.json(plantNote);
    }
    catch(err){
        next(err);
    }
} );

app.get('/api/plants/:id', async (req, res) =>{
    try{
        const plantId = Number(req.params.id);
        const plant = plants.find((target) => target.id === plantId);
        await  new Promise ((resolve) => setTimeout(resolve,500)) 
        plant
        ? res.json(plant) 
        : res.status(404).send("Plant not found")
    }
    catch(err){
        next(err);
    }    
} )

app.post('/api/plants', postHasNameAndType , (req, res, next) =>{
    try {
        const {name, type, sunlight} = req.body 
        const newPlant = {id: nextId, name, type, sunlight, watered: false }
        nextId++;
        plants.push(newPlant);
        res.status(201).json(newPlant);
     }
    catch(err){
        next(err);
    }
} )

app.post('/api/plants/:plantId/notes', (req, res, next) =>{
    try{
        const plantId = Number(req.params.plantId);
        const {note} = req.body;
        const newNote = {id: nextNoteId, plantId: plantId, note};
        nextNoteId++;
        careNotes.push(newNote);
        res.status(201).json(newNote);
    }
    catch(err){
        next(err);
    }
} )

app.patch('/api/plants/:id', (req, res, next) =>{
    try{
        const plantId = Number(req.params.id);
        const plantToUpdate = plants.find((target) => target.id === plantId);
        plantToUpdate 
        ? Object.assign(plantToUpdate, req.body) 
        && res.status(201).json(plantToUpdate) 
        : res.status(404).send('Plant not found')
    }
    catch(err){
        next(err);
    }
} )

app.delete('/api/plants/:id', (req, res, next) =>{
    try{
        const plantId = Number(req.params.id);
        plants = plants.filter((target) => { return target.id !== plantId});
        console.log(`Plant ${plantId} deleted`)
        res.status(204).send();
    }
    catch(err){
        next(err)
    }
} )

app.delete('/api/notes/:id', (req, res, next) =>{
    try{
        const noteId = Number(req.params.id);
        careNotes = careNotes.filter(note => note.id !== noteId)
        res.status(204).send();
    }
    catch(err){
        next(err)
    }
} )
app.listen(PORT, () => console.log('Server Running on port 8080') )
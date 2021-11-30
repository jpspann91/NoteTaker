//Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const database = require('./db/db.json')

//Initialize express app and PORT number
const app = express();
const PORT = process.env.PORT || 3000;

//Setup security guard
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//Set up routes on page load home page end point sends to index.html
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})
//End point /notes  to the notes.html page
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

//Add get and post for routes to /api/notes end point
app.route("/api/notes")
    // Grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post((req, res) => {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // This allows the test note to be the original note.
        let highestId = 99;
        // Loops through the array and finds the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // We push it to db.json.
        database.push(newNote)

        // Write the db.json file again.
        fs.writeFile(jsonFilePath, JSON.stringify(database), (err) =>{
            //if error than throw an error
            if (err) throw err
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });
//Delete requests on id parameter
app.delete('/api/notes/:id', (req, res) =>{

    let jsonFilePath = path.join(__dirname, '/db/db.json');
    //request to delete note by id
    for(let i = 0; i < database.length; i++){

        if(database[i].id == req.params.id){
            //splice from i position then delete the note
            database.splice(i , 1);
            break;
        }
    }
    //Write to the db.json file turn database array into a string
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), (err)=>{
        //if error throw an error
        if (err) throw err;
        else {console.log("Your note was deleted");}
    });
    // responds with updated database data as a json object
    res.json(database);
});

//PORT Listener
app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
})




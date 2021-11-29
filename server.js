//Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const database = require('./db/db.json')

//Initialize express app and PORT number
const app = express();
const PORT = process.env.PORT || 3000;

//Setup securiy guard
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//Set up routes on page load
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

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
        // This loops through the array and finds the highest ID.
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

            if (err) throw err
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });


//PORT Listener
app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
})




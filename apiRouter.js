'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { MoodEntry, Mood, User } = require('./models');

const router = express.Router();

/*
sample entry
{
    "moods": [
      {"moodType": "happy", "intensity": "5"},
      {"moodType": "sad", "intensity": "3"}
    ],
    "note": "this is a sample note"
}
*/

// return all mood entries for logged in user
router.get('/mood-entries/:user', (req, res) => {
    MoodEntry.find(req.query.user)
      .populate('moods')
      .then(entries => {
          res.json({ entries });
          console.log("Current entries: " + { entries })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({message: 'Internal server error'});
  });
});

// create a mood entry
router.post('/mood-entries', (req, res) => {
    console.log(req.body);
    // create all the moods, ids of moods store those in the mood entry and save them to repopulate later
    let moodRecords = [];
    req.body.forEach(function (entry) {
        entry.moods.forEach(function(mood) {
            Mood.create(mood)
            .then(moodRecord => {
                console.log(moodRecord);
                moodRecords.push(moodRecord._id);
                console.log(moodRecords);
                console.log(entry.moods);
                if(moodRecords.length == entry.moods.length){

                    // create the mood entry

                    MoodEntry.create({user: entry.user, note: entry.note, moods: moodRecords})
                        .then(entryRecord => {
                            console.log(entryRecord);
                            return res.status(201).json(entryRecord);
                        })
                        .catch(err => {
                            console.log(err);
                        });

                }
            })
    });

});

});


// delete a mood entry
router.delete('/mood-entries/:id', (req, res) => {
    console.log(req.id)
    MoodEntry.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'})
    })
});


  module.exports = router;
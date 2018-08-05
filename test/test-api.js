'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { MoodEntry } = require('../models');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('/api/moodentries', function () {

        before(function () {
            return runServer(TEST_DATABASE_URL);
        });

        after(function () {
            return closeServer();
        });

        beforeEach(function () { });

        afterEach(function () {
            return MoodEntry.remove({});
        });

  describe('/api/moodsense/entries', function () {

        describe('GET', function () {
            it('should return all entries', function () {
                chai.request(app)
                    .get('/api/moodsense/entries')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                    });
                });
            });
    
    
        describe('POST', function () {
            it('should add an entry on POST', function() {
                const newEntry = 
                {
                    moods: [
                        {moodType: "happy", "intensity": "5"},
                        {moodType: "sad", "intensity": "3"}
                    ],
                    note: "this is a sample note"
                }
            chai.request(app)
                .post('/api/moodsense/entries')
                .send(newEntry)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('moods, note');
                    res.body.errors.pages.should.have.property('kind').eql('required');
                });
            });
        });

        describe('DELETE', function () {
            it('should delete an entry by id', function() {
                const newEntry = 
                {
                    id: 1,
                    moods: [
                        {moodType: "happy", "intensity": "5"},
                        {moodType: "sad", "intensity": "3"}
                    ],
                    note: "this is a sample note"
                }
            chai.request(app)
                .delete('/api/moodsense/entries/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(0);
                });
            });
        });    
    });  
});

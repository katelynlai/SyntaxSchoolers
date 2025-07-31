const request = require('supertest');       
const app = require('../app');               
const db = require('../database/connect');   
const fs = require('fs');                    
const path = require('path');                

// Test setup for Level 3 routes
// This file will test the Level 3 functionality of the application
describe('Level 3 Integration Tests', () => {
  // Before all tests, reset the database file to match level 3 database
  beforeAll(async () => {
    const setupSQL = fs.readFileSync(path.join(__dirname, '../database/setup3.sql')).toString();
    await db.query(setupSQL); 
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await db.end();
  });

  // Test the GET /app/sentence route
  describe('GET /app/sentence', () => {
    it('should return a random sentence with necessary fields', async () => {
      const response = await request(app).get('/app/sentence');
        
      expect(response.statusCode).toBe(200); // Expect a successful response
      expect(response.body).toHaveProperty('sentence_id');         
      expect(response.body).toHaveProperty('english');             
      expect(response.body).toHaveProperty('shuffled');            
      expect(response.body).toHaveProperty('category_id');         
    });
  });

  // Test the POST /app/sentence/submit-sentence route
  describe('POST /app/sentence/submit-sentence', () => {
    it('should return correct=true when sentence is correct', async () => {
        // Get a random sentence to use for submission
      const getResponse = await request(app).get('/app/sentence');
      const sentence = getResponse.body;

      // Send the correct sentence (actual words from the DB, already in correct order)
      const correctOrder = sentence.french.trim().split(/\s+/); // correct sentence as an array

      const response = await request(app)
        .post('/app/sentence/submit-sentence')
        .send({
          sentenceId: sentence.sentence_id,      
          sentence: correctOrder,               
          userId: 1,                              
          levelId: 3                              
        });

      expect(response.statusCode).toBe(200);              
      expect(response.body).toHaveProperty('correct');    
      expect(response.body).toHaveProperty('levelStatus');
      expect(typeof response.body.correct).toBe('boolean');
    });

    it('should return correct=false for wrong sentence', async () => {

      const getResponse = await request(app).get('/app/sentence');
      const sentence = getResponse.body;


      const wrongSentence = ['invalid', 'sentence'];

      const response = await request(app)
        .post('/app/sentence/submit-sentence')
        .send({
          sentenceId: sentence.sentence_id,
          sentence: wrongSentence,
          userId: 1,
          levelId: 3
        });

      expect(response.statusCode).toBe(200);          
      expect(response.body.correct).toBe(false);      
    });

    it('should return 400 if body is invalid', async () => {
      const response = await request(app)
        .post('/app/sentence/submit-sentence')
        .send({}); // Missing required fields

      expect(response.statusCode).toBe(400);          
      expect(response.body).toHaveProperty('error');   
    });
  });
});
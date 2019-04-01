/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const libraryhandler = require('../controller/libraryhandler.js')

const MONGO_URI = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
const libraryHandler = new libraryhandler();
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     const query = req.query;
     const getBooks = libraryHandler.getBook(query)
     MongoClient.connect(MONGO_URI, function(err, db) {
         db.collection('books').find(getBooks).sort({updated_on: - 1}).toArray((err, docs) => {
           if (!err) res.json(docs);
           else {
           res.send(err)
           }
          
          db.close();
        });
      }); 
    })
    
    .post(function (req, res){
      var body = req.body;
      const newBook =  libraryHandler.postBook(body)
      //response will contain new book object including atleast _id and title
      if(newBook == 'No input was given') return res.type('text').send(newBook);
      else {
    
      MongoClient.connect(MONGO_URI, function(err, db) {
      db.collection('books').insertOne(newBook, function(err, docs) {
      if(err) res.send(err);
      res.json(docs.ops[0])
        
        db.close();
        });
      });
        
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    MongoClient.connect(MONGO_URI, function(err, db) {
    db.collection('books').remove({}, function(err, docs) {
    if(err) res.send(err);
      res.type('text').send('Complete delete successful')
      
      db.close();
        });
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const getBookWithId = libraryHandler.getBookWithId(bookid);
    
       MongoClient.connect(MONGO_URI, function(err, db) {
         db.collection('books').find(getBookWithId).toArray((err, docs) => {
           if (err) res.send(err);
           
           if(docs.length === 0) res.type('text').send("No book exist");
           else{
           res.json(docs[0])
           }
          
          db.close();
         });
      }); 
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      const query = libraryHandler.addComment(bookid);
      
      //json res format same as .get
    MongoClient.connect(MONGO_URI, function(err, db) {
      db.collection('books').findOneAndUpdate(query, {$inc: {commentcount: 1}, $push: {comments : comment}}, {returnOriginal: false}, function(err, docs) {
        if(err) res.send(err);
        
        if(docs !== null && docs !== undefined) {
          res.json(docs.value)
        } else {
        res.send("The "+ bookid + " id doesn't exist in the server.")
        
        }
        
        db.close();
        });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    const query = {_id: bookid};
      //if successful response will be 'delete successful'
    MongoClient.connect(MONGO_URI, function(err, db) {
      db.collection('books').deleteOne(query, function(err, docs) {
        if(err) res.send(err);
        else {
        res.send('Delete successful')
        }
        db.close();
        });
      });
    });
  
};

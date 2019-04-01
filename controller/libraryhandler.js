const shortid = require('shortid');
function libraryhandler() {

  this.getBook = function(query) {
  return Object.keys(query).reduce((x, i) => { x[i] = query[i]; return x }, {})
  
  }
  
  this.getBookWithId = function(bookid) {
  const query = {_id: bookid };
  return query
  }
  
  this.postBook = function(body) {
  
  const id = shortid.generate(); // makes short unique ids
  
  if(body.title == '') return 'No input was given'
    
  const newBook = {
  title: body.title,
  commentcount: 0,
  comments: [],
  _id: id
  }
  
  return newBook
  }
  
  this.addComment = function(bookid) {
  const query = {_id: bookid};
  return query
  }
  
}
module.exports = libraryhandler;
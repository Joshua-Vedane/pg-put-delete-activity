$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.deleteBtn', handleDelete);
  $('#bookShelf').on('click', '.readBtn', handleReadStatus);

}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}

//Delete Book from the server
function handleDelete() {
  console.log('clicked delete');
  const id = $(this).closest('tr').data('id');
  console.log(id);
  $.ajax({
    type: 'DELETE',
    url: `/books/${id}`
  }).then(function(response){
    //get updated list
    refreshBooks();
  }).catch(function(error){
    alert('error in delete');
  })
}

function handleReadStatus() {
  const id = $(this).closest('tr').data('id');
  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    //not sure if data is required
  }).then(function(response){
    console.log('updated');
    refreshBooks();
  }).catch(function(error){
    alert('error in updating');
  })

}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    //make a table row in memory
    let $tr = $(`<tr data-id=${book.id}></tr>`);
    //since it's a jquery variable, we can do jq stuff with it. 
    //attatching entire book object as .data
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td><button class='deleteBtn'>DELETE</button>`)
    $tr.append(`<td><button class='readBtn'>Mark As Read</button></td>`)
    
    // console.log($tr);
    $('#bookShelf').append($tr);
  }
}

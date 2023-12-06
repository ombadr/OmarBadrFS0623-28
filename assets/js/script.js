const booksContainer = document.querySelector('#books-container');
const cartContainer = document.querySelector('#cart-container');

let fetchedBooks = []

let cart = JSON.parse(localStorage.getItem('cart')) || []

window.onload = () => {
    getBooks()
    loadCart()
}

function getBooks() {
    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json())
        .then(books => {
            displayBooks(books)
            fetchedBooks = books
        })
        .catch(err => console.log(err))
}

function displayBooks(books) {
    booksContainer.innerHTML = ''

    books.forEach((book) => {

        const isBookInCart = cart.findIndex(cartBook => cartBook.title === book.title) !== -1

        booksContainer.innerHTML += `<div class="col">
              <div class="card h-100 ${isBookInCart ? 'selected' : ''}">
                <img src="${book.img}" class="img-fluid card-img-top" alt="${book.title
            }">
                <div class="card-body">
                  <h5 class="card-title">${book.title}</h5>
                  <p class="card-text badge rounded-pill bg-dark mb-2">${book.category}</p>
                  <p class="fs-4">${book.price}€</p>
                  <div>
                      <button class="btn btn-success" onclick="addToCart(event, '${book.asin}')">Compra ora</button>
                      <button class="btn btn-outline-success" onclick="removeBook(event)">
                        Scarta
                      </button>
                  </div>
                </div>
              </div>
            </div>`
    })
}

function removeBook(event) {
    event.target.closest('.col').remove()
}


function addToCart(event, asin) {
    const book = fetchedBooks.find((book) => book.asin === asin)
    cart.push(book)
    localStorage.setItem('cart', JSON.stringify(cart))

    event.target.closest('.card').classList.add('selected')

    loadCart()
}

function loadCart() {

    cartContainer.innerHTML = ''

    cart.forEach((book) => {
        cartContainer.innerHTML += `
            <div class="shopping-item">
              <div class="d-flex align-items-start gap-2">
                    <img src=${book.img}  class="img-fluid" width="60" />
                  <div class="flex-grow-1">
                      <p class="mb-2">
                        ${book.title}
                      </p>
                      <div class="d-flex justify-content-between">
                          <p class="fw-bold">
                            ${book.price}€
                          </p>
                          <div>
                              <div>
                                <button class="btn btn-danger" onclick="deleteBookFromCart(event, '${book.asin}')">Elimina</button>
                              </div>
                          </div>
                      </div >
                  </div >
              </div >
            </div>
          `;
    });
}

function deleteBookFromCart(event, asin) {
    const index = cart.findIndex((book) => book.asin === asin)

    if (index !== -1) {
        cart.splice(index, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    event.target.closest('.shopping-item').remove()
    loadCart()
}
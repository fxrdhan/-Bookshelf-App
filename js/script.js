document.addEventListener("DOMContentLoaded", () => {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");
  const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
  const submitButton = document.getElementById("bookFormSubmit");

  const updateSubmitButtonText = (isChecked) => {
    submitButton.innerHTML = `Masukkan Buku ke rak <span>${
      isChecked ? "Selesai dibaca" : "Belum selesai dibaca"
    }</span>`;
  };

  isCompleteCheckbox.addEventListener("change", (e) => {
    updateSubmitButtonText(e.target.checked);
  });

  updateSubmitButtonText(isCompleteCheckbox.checked);

  const generateId = () => Date.now().toString();

  const saveBooks = () => {
    localStorage.setItem("books", JSON.stringify(books));
  };

  const createBookElement = (book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book-item";
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div class="book-actions">
        <button class="btn-complete" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button class="btn-delete" data-testid="bookItemDeleteButton" style="display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" style="margin-right: 4px;">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
          <span>Hapus</span>
        </button>
        <button class="btn-edit" data-testid="bookItemEditButton" style="display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" style="margin-right: 4px;">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
          </svg>
          <span>Edit</span>
        </button>
      </div>
    `;

    const completeButton = bookElement.querySelector(
      '[data-testid="bookItemIsCompleteButton"]'
    );
    const deleteButton = bookElement.querySelector(
      '[data-testid="bookItemDeleteButton"]'
    );
    const editButton = bookElement.querySelector(
      '[data-testid="bookItemEditButton"]'
    );

    completeButton.onclick = () => toggleBookComplete(book.id);
    deleteButton.onclick = () => deleteBook(book.id);
    editButton.onclick = () => editBook(book.id);

    return bookElement;
  };

  const renderBooks = (filteredBooks = books) => {
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeList.appendChild(bookElement);
      } else {
        incompleteList.appendChild(bookElement);
      }
    });
  };

  const addBook = (event) => {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    if (isNaN(year) || year < 0) {
      alert("Tahun harus berupa angka positif.");
      return;
    }
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const newBook = {
      id: generateId(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(newBook);
    saveBooks();
    renderBooks();
    event.target.reset();
    updateSubmitButtonText(false);
  };

  const toggleBookComplete = (id) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  };

  const deleteBook = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      books = books.filter((b) => b.id !== id);
      saveBooks();
      renderBooks();
      if (editingBookId === id) {
        hideEditForm();
      }
    }
  };

  const editBook = (id) => {
    if (editingBookId === id) {
      hideEditForm();
    } else {
      const book = books.find((b) => b.id === id);
      if (book) {
        showEditForm(book);
      }
    }
  };

  const searchBooks = (event) => {
    event.preventDefault();
    const searchTerm = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);

    const notification = document.getElementById("notification");
    if (filteredBooks.length === 0) {
      notification.style.display = "block";
      notification.textContent = "Buku tidak ditemukan!";
    } else {
      notification.style.display = "none";
    }
  };

  const editForm = document.getElementById("editForm");
  const editFormTitle = document.getElementById("editFormTitle");
  const editFormAuthor = document.getElementById("editFormAuthor");
  const editFormYear = document.getElementById("editFormYear");
  const editFormIsComplete = document.getElementById("editFormIsComplete");
  const editFormSubmit = document.getElementById("editFormSubmit");
  let editingBookId = null;

  const showEditForm = (book) => {
    editFormTitle.value = book.title;
    editFormAuthor.value = book.author;
    editFormYear.value = book.year;
    editFormIsComplete.checked = book.isComplete;
    editingBookId = book.id;
    editForm.style.display = "block";
  };

  const hideEditForm = () => {
    editForm.style.display = "none";
    editingBookId = null;
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const updatedBook = {
      id: editingBookId,
      title: editFormTitle.value,
      author: editFormAuthor.value,
      year: parseInt(editFormYear.value),
      isComplete: editFormIsComplete.checked,
    };
    books = books.map((book) =>
      book.id === editingBookId ? updatedBook : book
    );
    saveBooks();
    renderBooks();
    hideEditForm();
  };

  const handleEditFormCancel = (event) => {
    event.preventDefault();
    hideEditForm();
  };

  editForm.addEventListener("submit", handleEditFormSubmit);
  document
    .getElementById("editFormCancel")
    .addEventListener("click", handleEditFormCancel);

  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBooks);

  renderBooks();
});

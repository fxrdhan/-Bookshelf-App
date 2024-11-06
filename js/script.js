document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    if (theme === "light") {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  };

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "light" ? "dark" : "light");
  });

  let books = JSON.parse(localStorage.getItem("books")) || [];

  const bookForm = document.getElementById("bookForm");
  const searchInput = document.getElementById("searchBookTitle");
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
      <div class="book-content">
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      </div>
      <button class="book-menu-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </svg>
      </button>
      <div class="book-actions">
        <button class="btn-complete" data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
        </svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
        </svg>`
        }
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button class="btn-edit" data-testid="bookItemEditButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
          </svg>
          Edit
        </button>
        <button class="btn-delete" data-testid="bookItemDeleteButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
          Hapus
        </button>
      </div>
    `;

    const menuToggle = bookElement.querySelector(".book-menu-toggle");
    const actionsMenu = bookElement.querySelector(".book-actions");
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      actionsMenu.classList.toggle("show");
    });

    completeButton.onclick = () => {
      actionsMenu.classList.remove("show");
      toggleBookComplete(book.id);
    };
    deleteButton.onclick = () => {
      actionsMenu.classList.remove("show");
      deleteBook(book.id);
    };
    editButton.onclick = (e) => {
      e.stopPropagation(); // Hentikan event bubbling
      actionsMenu.classList.remove("show");
      editBook(book.id); // Langsung panggil editBook dengan book.id
    };

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

  const addBookModal = document.getElementById("addBookModal");
  const showAddBookBtn = document.getElementById("showAddBook");
  const closeAddBookBtn = document.getElementById("closeAddBook");

  const openAddBookModal = () => {
    addBookModal.style.display = "block";
    document.body.classList.add("modal-open");
  };

  const closeAddBookModal = () => {
    addBookModal.style.display = "none";
    document.body.classList.remove("modal-open");
  };

  showAddBookBtn.addEventListener("click", openAddBookModal);
  closeAddBookBtn.addEventListener("click", closeAddBookModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === addBookModal) {
      closeAddBookModal();
    }
  });

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
    closeAddBookModal();
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
    const book = books.find((b) => b.id === id);
    if (book) {
      showEditForm(book);
    }
  };

  const searchBooks = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
  };

  searchInput.addEventListener("input", searchBooks);

  const editForm = document.getElementById("editForm");
  const editFormTitle = document.getElementById("editFormTitle");
  const editFormAuthor = document.getElementById("editFormAuthor");
  const editFormYear = document.getElementById("editFormYear");
  const editFormIsComplete = document.getElementById("editFormIsComplete");
  const editFormSubmit = document.getElementById("editFormSubmit");
  let editingBookId = null;

  const editBookModal = document.getElementById("editBookModal");
  const closeEditBookBtn = document.getElementById("closeEditBook");

  const openEditBookModal = () => {
    editBookModal.style.display = "block";
    document.body.classList.add("modal-open");
  };

  const closeEditBookModal = () => {
    editBookModal.style.display = "none";
    document.body.classList.remove("modal-open");
  };

  closeEditBookBtn.addEventListener("click", closeEditBookModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === editBookModal) {
      closeEditBookModal();
    }
  });

  const showEditForm = (book) => {
    editFormTitle.value = book.title;
    editFormAuthor.value = book.author;
    editFormYear.value = book.year;
    editingBookId = book.id;
    openEditBookModal();
  };

  const hideEditForm = () => {
    closeEditBookModal();
    editingBookId = null;
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const book = books.find(b => b.id === editingBookId);
    const updatedBook = {
      id: editingBookId,
      title: editFormTitle.value,
      author: editFormAuthor.value,
      year: parseInt(editFormYear.value),
      isComplete: book.isComplete // Gunakan status sebelumnya
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

  renderBooks();
});

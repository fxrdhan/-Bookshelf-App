// Define default book cover as SVG data URI for fallback when no cover image is provided
const DEFAULT_BOOK_COVER = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  <rect width="200" height="300" fill="#6d28d9" />
  <defs>
    <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#16325B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A1A1D;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="300" fill="url(#coverGradient)" />
  <path d="M60 100 L140 100 L140 200 L60 200 Z" fill="none" stroke="white" stroke-width="4"/>
  <path d="M60 100 C80 100 120 100 140 100" stroke="white" stroke-width="4" fill="none"/>
  <path d="M60 200 C80 200 120 200 140 200" stroke="white" stroke-width="4" fill="none"/>
  <rect x="75" y="125" width="50" height="3" fill="white" opacity="0.8"/>
  <rect x="75" y="135" width="40" height="3" fill="white" opacity="0.8"/>
  <rect x="75" y="145" width="45" height="3" fill="white" opacity="0.8"/>
  <text x="100" y="240" text-anchor="middle" fill="white" font-family="sans-serif" font-size="16">No Cover</text>
</svg>`)}`;

// Track sorting order for complete and incomplete book sections
let sortOrders = {
  incomplete: 'asc',
  complete: 'asc',
  favorite: 'asc'
};

/**
 * Sorts an array of books by title.
 * @param {Array} books - Array of book objects to sort.
 * @param {string} [order='asc'] - Sort direction ('asc' for ascending or 'desc' for descending).
 * @returns {Array} Sorted array of books.
 */
const sortBooks = (books, order = 'asc') => {
  return [...books].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (order === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });
};

// Main initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize theme toggling functionality
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  /**
   * Sets the application theme and updates UI accordingly.
   * @param {string} theme - Theme to set ('light' or 'dark').
   */
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

  // Load saved theme preference from localStorage or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  // Handle theme toggle button clicks
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "light" ? "dark" : "light");
  });

  // Initialize books array and load from localStorage
  let books = [];

  const storedBooks = localStorage.getItem("books");

  // Safely parse stored books with error handling
  try {
    books = storedBooks ? JSON.parse(storedBooks) : [];
  } catch (error) {
    console.error("Error parsing books from localStorage:", error);
    books = [];
  }

  // If no books found, initialize with default books
  if (!Array.isArray(books) || books.length === 0) {
    books = defaultBooks;
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Cache DOM elements for better performance
  const bookForm = document.getElementById("bookForm");
  const searchInput = document.getElementById("searchBookTitle");
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");
  const favoriteList = document.getElementById("favoriteBookList");
  const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
  const submitButton = document.getElementById("bookFormSubmit");

  /**
   * Updates the submit button text based on the checkbox state.
   * Improves UX by showing the user where the book will be placed.
   */
  const updateSubmitButton = () => {
    const isChecked = isCompleteCheckbox.checked;
    submitButton.innerHTML = isChecked
      ? 'Masukkan Buku ke rak <span>Selesai dibaca</span>'
      : 'Masukkan Buku ke rak <span>Blm. selesai dibaca</span>';
  };

  // Attach event listener for completion status changes
  isCompleteCheckbox.addEventListener("change", updateSubmitButton);
  updateSubmitButton();

  /**
   * Generates a unique ID for new books
   * @returns {string} Timestamp-based unique identifier
   */
  const generateId = () => Date.now().toString();

  /**
   * Persists books array to localStorage.
   * Should be called after any modification to books array.
   */
  const saveBooks = () => {
    localStorage.setItem("books", JSON.stringify(books));
  };

  /**
   * Toggle favorite status of a book
   * @param {string} id - Book ID to toggle favorite status
   */
  const toggleFavorite = (id) => {
    const book = books.find(b => b.id === id);
    if (book) {
      book.isFavorite = !book.isFavorite;
      saveBooks();
      const currentMode = localStorage.getItem('viewMode') || 'grid';
      renderBooks();
      setViewMode(currentMode);
    }
  };

  /**
    * Creates a DOM element for a book with all necessary event handlers
    * @param {Object} book - Book object containing title, author, etc.
    * @returns {HTMLElement} Complete book element ready for insertion
    */
  const createBookElement = (book) => {
    const bookElement = document.createElement("div");
    bookElement.className = `book-item${book.isFavorite ? ' favorite' : ''}`;
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    // Use default cover if none provided
    const coverSrc = book.cover || DEFAULT_BOOK_COVER;

    // Build book element HTML structure
    bookElement.innerHTML += `
      <img src="${coverSrc}" class="book-cover" alt="Cover ${book.title}">
      <div class="book-content">
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">${book.author}</p>
        <p data-testid="bookItemYear">${book.year}</p>
      </div>
      <button class="favorite-toggle ${book.isFavorite ? 'active' : ''}" aria-label="Toggle favorite">
        ${book.isFavorite ? 
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>` : 
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
          </svg>`
        }
      </button>
      </div>
      <button class="book-menu-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </svg>
      </button>
      <div class="book-actions">
        <button class="btn-complete" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Blm. selesai dibaca" : "Selesai dibaca"}
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

    // Set up menu toggle functionality
    const menuToggle = bookElement.querySelector(".book-menu-toggle");
    const actionsMenu = bookElement.querySelector(".book-actions");

    /**
      * Handles menu toggle clicks
      * Closes other open menus and toggles current menu
      * @param {Event} e - Click event object
      */
    const menuToggleHandler = (e) => {
      e.stopPropagation();
      // Close any other open menus
      document.querySelectorAll('.book-item').forEach(item => {
        if (item !== bookElement) {
          item.classList.remove('menu-open');
          item.querySelector('.book-actions')?.classList.remove('show');
        }
      });
      actionsMenu.classList.toggle("show");
      bookElement.classList.toggle("menu-open");
    };

    // Ensure clean event listener attachment
    menuToggle.removeEventListener("click", menuToggleHandler);
    menuToggle.addEventListener("click", menuToggleHandler);
    menuToggle.style.pointerEvents = 'auto';

    // Setup favorite toggle button
    const favoriteButton = bookElement.querySelector('.favorite-toggle');
    favoriteButton.addEventListener('click', (e) => {
      toggleFavorite(book.id);
    });

    // Cache action buttons for better performance
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');

    // Attach event handlers to action buttons
    completeButton.addEventListener('click', (e) => {
      toggleBookComplete(book.id);
    });
    deleteButton.onclick = () => {
      actionsMenu.classList.remove("show");
      bookElement.classList.remove("menu-open");
      deleteBook(book.id);
    };
    editButton.onclick = (e) => {
      e.stopPropagation();
      actionsMenu.classList.remove("show");
      bookElement.classList.remove("menu-open");
      editBook(book.id);
    };

    return bookElement;
  };

  /**
    * Global click handler to close book menus when clicking outside
    * Improves UX by preventing multiple open menus
    */
  document.addEventListener('click', (e) => {
    const menus = document.querySelectorAll('.book-actions.show');
    const menuToggles = document.querySelectorAll('.book-menu-toggle');

    // Close menus if click is outside menu and toggle button
    if (!e.target.closest('.book-actions') && !e.target.closest('.book-menu-toggle')) {
      menus.forEach(menu => {
        menu.classList.remove('show');
        menu.closest('.book-item').classList.remove('menu-open');
      });
    }
  });

  /**
    * Creates a "View All" button for book sections
    * Used when number of books exceeds display threshold
    * @returns {HTMLButtonElement} Configured button element
    */
  function createViewAllButton() {
    const button = document.createElement("button");
    button.className = "view-all-button";
    button.textContent = "Lihat Semua";
    return button;
  }

  /**
    * Renders a section of books with collapse functionality
    * @param {Array} books - Array of book objects to render
    * @param {HTMLElement} listElement - Container element for books
    * @param {HTMLButtonElement} viewAllButton - Button to show all books
    */
  const renderBookSection = (books, listElement, viewAllButton) => {
    // Clear existing content
    listElement.innerHTML = "";
    const parentSection = listElement.parentElement;
    const existingViewAllButton = parentSection.querySelector('.view-all-button');
    if (existingViewAllButton) {
      existingViewAllButton.remove();
    }

    // Get current view mode from localStorage
    const currentViewMode = localStorage.getItem('viewMode') || 'grid';

    // Create and append book elements
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      listElement.appendChild(bookElement);
    });

    /**
      * Applies collapse functionality to book list
      * @param {HTMLElement} list - Book list container
      * @param {HTMLButtonElement} button - View all button
      */
    const applyCollapse = (list, button) => {
      // Adjust threshold based on screen size
      const isDesktop = window.innerWidth >= 769;
      const threshold = isDesktop ? 6 : 3;

      // Apply collapse if books exceed threshold
      if (list.children.length > threshold) {
        list.classList.add('collapsed');
        button.classList.add('visible');
        list.parentElement.appendChild(button);

        // Remove existing handler before adding new one
        button.removeEventListener('click', button.toggleCollapseHandler);

        // Toggle collapse state and update button text
        button.toggleCollapseHandler = () => {
          list.classList.toggle('collapsed');
          button.textContent = list.classList.contains('collapsed') ? 'Lihat Semua' : 'Lihat Sedikit';
        };

        button.addEventListener('click', button.toggleCollapseHandler);
      } else {
        list.classList.remove('collapsed');
      }
    };

    applyCollapse(listElement, viewAllButton);

    // Update view mode classes
    listElement.classList.remove('grid-view', 'cover-view');
    listElement.classList.add(`${currentViewMode}-view`);

    // Attach handlers for book cover interactions
    attachBookCoverHandlers();
  };

  /**
    * Main function to render all books with filtering and sorting
    * @param {Array} filteredBooks - Optional array of filtered books to display
    */
  const renderBooks = (filteredBooks = books) => {
    const currentViewMode = localStorage.getItem('viewMode') || 'grid';
    const bookGrids = document.querySelectorAll('.book-grid');

    // Clean up existing view-all buttons
    document.querySelectorAll('.view-all-button').forEach(button => button.remove());

    // Split books into complete and incomplete lists
    const incompleteBooks = filteredBooks.filter(book => !book.isComplete);
    const completeBooks = filteredBooks.filter(book => book.isComplete);
    const favoriteBooks = filteredBooks.filter(book => book.isFavorite);

    // Apply current sort order to all lists
    const sortedCompleteBooks = sortBooks(completeBooks, sortOrders.complete);
    const sortedIncompleteBooks = sortBooks(incompleteBooks, sortOrders.incomplete);
    const sortedFavoriteBooks = sortBooks(favoriteBooks, sortOrders.favorite);

    // Update sort button visual states
    document.querySelectorAll('.sort-button').forEach(button => {
      const section = button.dataset.section;
      button.classList.toggle('descending', sortOrders[section] === 'desc');
    });

    const incompleteViewAll = createViewAllButton();
    const completeViewAll = createViewAllButton();
    const favoriteViewAll = createViewAllButton();

    // Render both book sections
    renderBookSection(sortedIncompleteBooks, incompleteList, incompleteViewAll);
    renderBookSection(sortedFavoriteBooks, favoriteList, favoriteViewAll);
    renderBookSection(sortedCompleteBooks, completeList, completeViewAll);

    // Update grid view classes
    const newBookGrids = document.querySelectorAll('.book-grid');
    newBookGrids.forEach(grid => {
      grid.classList.remove('grid-view', 'cover-view');
      grid.classList.add(`${currentViewMode}-view`);
    });

    // Update view mode toggle button state
    const viewModeToggle = document.getElementById('viewModeToggle');
    viewModeToggle.classList.toggle('grid', currentViewMode === 'cover');
  };

  // Handle responsive layout changes
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    const isDesktop = currentWidth >= 769;
    const wasDesktop = lastWidth >= 769;
    // Reload page only when switching between mobile and desktop layouts
    if (isDesktop !== wasDesktop) {
      location.reload();
    }
    lastWidth = currentWidth;
  });

  // Modal handling for add book functionality
  const addBookModal = document.getElementById("addBookModal");
  const showAddBookBtn = document.getElementById("showAddBook");
  const closeAddBookBtn = document.getElementById("closeAddBook");

  /**
    * Toggles visibility of add book modal
    */
  const toggleAddBookModal = () => {
    addBookModal.style.display = addBookModal.style.display === "block" ? "none" : "block";
  };

  showAddBookBtn.addEventListener("click", toggleAddBookModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === addBookModal) {
      toggleAddBookModal();
    }
  });

  // Image cropping functionality
  let cropper = null;
  let currentCropInput = null;

  /**
    * Initializes image cropper with specified options
    * @param {HTMLElement} image - Image element to crop
    * @param {number} aspectRatio - Desired aspect ratio for cropping
    */
  const initCropper = (image, aspectRatio = 2 / 3) => {
    if (cropper) {
      cropper.destroy();
    }

    cropper = new Cropper(image, {
      aspectRatio: aspectRatio,
      viewMode: 2,
      dragMode: 'move',
      background: true,
      responsive: true,
      modal: true,
      guides: true,
      highlight: false,
      autoCropArea: 1,
    });
  };

  /**
    * Handles image selection for book covers
    * @param {HTMLInputElement} input - File input element
    */
  const handleImageSelect = (input) => {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const cropModal = document.getElementById('cropModal');
        const cropImage = document.getElementById('cropImage');

        cropImage.src = e.target.result;
        cropModal.style.display = 'block';
        document.body.classList.add('modal-open');

        cropImage.addEventListener('load', () => {
          initCropper(cropImage);
        }, { once: true });

        currentCropInput = input;
      };

      reader.readAsDataURL(file);
    }
  };

  // Attach image selection handlers to both form inputs
  document.getElementById('bookFormCover').addEventListener('change', (e) => {
    handleImageSelect(e.target);
  });

  document.getElementById('editFormCover').addEventListener('change', (e) => {
    handleImageSelect(e.target);
  });

  // Handle crop modal cancel action
  document.getElementById('cancelCrop').addEventListener('click', () => {
    const cropModal = document.getElementById('cropModal');
    cropModal.style.display = 'none';
    document.body.classList.remove('modal-open');
    // Reset input and cropper state
    if (currentCropInput) {
      currentCropInput.value = '';
      currentCropInput = null;
    }
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  });

  // Handle crop application
  document.getElementById('applyCrop').addEventListener('click', () => {
    if (cropper && currentCropInput) {
      // Create high-quality cropped image
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 600,
        height: 900,
      });

      // Convert canvas to data URL with quality setting
      const croppedImage = croppedCanvas.toDataURL('image/jpeg', 0.9);
      currentCropInput.dataset.croppedImage = croppedImage;

      // Enable preview button for corresponding form
      const previewBtn = currentCropInput.id === 'bookFormCover' ?
        document.getElementById('previewCoverBtn') :
        document.getElementById('previewEditCoverBtn');
      previewBtn.disabled = false;

      // Clean up crop modal
      const cropModal = document.getElementById('cropModal');
      cropModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      cropper.destroy();
      cropper = null;
    }
  });

  /**
    * Handles book addition form submission
    * @param {Event} event - Form submission event
    */
  const addBook = (event) => {
    event.preventDefault();

    // Collect form data
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);

    // Validate year input
    if (isNaN(year) || year < 0) {
      alert("Tahun harus berupa angka positif.");
      return;
    }

    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const coverInput = document.getElementById("bookFormCover");

    let coverUrl = null;

    /**
      * Creates a new book and saves it to storage
      * @param {string} coverUrl - URL or data URI of book cover
      */
    const createAndSaveBook = (coverUrl) => {
      const newBook = {
        id: generateId(),
        title,
        author,
        year,
        isComplete,
        isFavorite: false,
        cover: coverUrl || DEFAULT_BOOK_COVER
      };

      books.push(newBook);
      saveBooks();
      renderBooks();
      toggleAddBookModal();
      event.target.reset();
      updateSubmitButton(false);
    };

    // Handle different cover image scenarios
    if (coverInput.dataset.croppedImage) {
      createAndSaveBook(coverInput.dataset.croppedImage);
    } else if (coverInput.files && coverInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        createAndSaveBook(e.target.result);
      };
      reader.readAsDataURL(coverInput.files[0]);
    } else {
      createAndSaveBook(null);
    }
  };

  /**
    * Toggles the completion status of a book
    * @param {string} id - ID of the book to toggle
    */
  const toggleBookComplete = (id) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      const currentMode = localStorage.getItem('viewMode') || 'grid';
      renderBooks();
      setViewMode(currentMode);
    }
  };

  /**
    * Deletes a book after confirmation
    * @param {string} id - ID of the book to delete
    */
  const deleteBook = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      books = books.filter((b) => b.id !== id);
      saveBooks();
      renderBooks();
      // Close edit form if deleting currently edited book
      if (editingBookId === id) {
        hideEditForm();
      }
    }
  };

  /**
    * Initiates book editing process
    * @param {string} id - ID of the book to edit
    */
  const editBook = (id) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      showEditForm(book);
    }
  };

  /**
    * Handles book search functionality
    * Filters books based on title match
    */
  const searchBooks = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
  };

  // Attach search input handler
  searchInput.addEventListener("input", searchBooks);

  // Cache edit form elements
  const editForm = document.getElementById("editForm");
  const editFormTitle = document.getElementById("editFormTitle");
  const editFormAuthor = document.getElementById("editFormAuthor");
  const editFormYear = document.getElementById("editFormYear");
  const editFormIsComplete = document.getElementById("editFormIsComplete");
  const editFormSubmit = document.getElementById("editFormSubmit");
  let editingBookId = null;

  // Edit modal elements and handlers
  const editBookModal = document.getElementById("editBookModal");
  const closeEditBookBtn = document.getElementById("closeEditBook");

  /**
    * Opens edit book modal and sets modal state
    */
  const openEditBookModal = () => {
    editBookModal.style.display = "block";
    document.body.classList.add("modal-open");
  };

  /**
    * Closes edit book modal and resets state
    */
  const closeEditBookModal = () => {
    editBookModal.style.display = "none";
    document.body.classList.remove("modal-open");
  };

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === editBookModal) {
      closeEditBookModal();
    }
  });

  /**
    * Populates edit form with book data
    * @param {Object} book - Book object to edit
    */
  const showEditForm = (book) => {
    editFormTitle.value = book.title;
    editFormAuthor.value = book.author;
    editFormYear.value = book.year;
    editingBookId = book.id;
    openEditBookModal();
  };

  /**
    * Hides edit form and resets editing state
    */
  const hideEditForm = () => {
    closeEditBookModal();
    editingBookId = null;
  };

  /**
    * Handles edit form submission
    * @param {Event} event - Form submission event
    */
  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const book = books.find(b => b.id === editingBookId);
    const coverInput = document.getElementById("editFormCover");

    /**
      * Updates book with new data and cover
      * @param {string} coverUrl - New cover URL or data URI
      */
    const updateBookWithCover = (coverUrl) => {
      const updatedBook = {
        ...book,
        title: editFormTitle.value,
        author: editFormAuthor.value,
        year: parseInt(editFormYear.value),
        cover: coverUrl || book.cover || DEFAULT_BOOK_COVER
      };

      books = books.map((b) =>
        b.id === editingBookId ? updatedBook : b
      );
      saveBooks();
      renderBooks();
      hideEditForm();
    };

    // Handle different cover update scenarios
    if (coverInput.dataset.croppedImage) {
      updateBookWithCover(coverInput.dataset.croppedImage);
    } else if (coverInput.files && coverInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateBookWithCover(e.target.result);
      };
      reader.readAsDataURL(coverInput.files[0]);
    } else {
      updateBookWithCover(null);
    }
  };

  /**
    * Handles cancellation of edit form
    * @param {Event} event - Cancel button click event
    */
  const handleEditFormCancel = (event) => {
    event.preventDefault();
    hideEditForm();
  };

  // Attach form event handlers
  editForm.addEventListener("submit", handleEditFormSubmit);
  document
    .getElementById("editFormCancel")
    .addEventListener("click", handleEditFormCancel);

  bookForm.addEventListener("submit", addBook);

  // Initial render of books
  renderBooks();

  /**
    * Sets up image preview functionality for book covers
    * @param {string} inputId - ID of file input element
    * @param {string} previewBtnId - ID of preview button element
    */
  const setupImagePreview = (inputId, previewBtnId) => {
    const input = document.getElementById(inputId);
    const previewBtn = document.getElementById(previewBtnId);

    // Disable preview button when new file is selected
    input.addEventListener('change', () => {
      previewBtn.disabled = true;
    });

    // Show preview modal when button is clicked
    previewBtn.addEventListener('click', () => {
      if (input.dataset.croppedImage) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalBookCover');
        modalImage.src = input.dataset.croppedImage;
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
      }
    });
  };

  // Setup preview for both add and edit forms
  setupImagePreview('bookFormCover', 'previewCoverBtn');
  setupImagePreview('editFormCover', 'previewEditCoverBtn');
  attachBookCoverHandlers();

  // Setup sort buttons for both book sections
  document.querySelectorAll('.sort-button').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.dataset.section;
      let targetList, filteredBooks;
      
      if (section === 'favorite') {
        targetList = favoriteList;
        filteredBooks = books.filter(book => book.isFavorite);
      } else {
        targetList = section === 'incomplete' ? incompleteList : completeList;
        filteredBooks = books.filter(book =>
        section === 'incomplete' ? !book.isComplete : book.isComplete
      );
      }

      // Toggle sort order and update button state
      sortOrders[section] = sortOrders[section] === 'asc' ? 'desc' : 'asc';
      button.classList.toggle('descending', sortOrders[section] === 'desc');

      const sortedBooks = sortBooks(filteredBooks, sortOrders[section]);
      const viewAllButton = createViewAllButton();
      renderBookSection(sortedBooks, targetList, viewAllButton);
    });
  });
});

/**
  * Sets view mode for book display (grid or cover)
  * @param {string} mode - Display mode ('grid' or 'cover')
  */
const setViewMode = (mode) => {
  const bookGrids = document.querySelectorAll('.book-grid');
  const currentMode = localStorage.getItem('viewMode') || 'grid';
  const viewModeToggle = document.getElementById('viewModeToggle');

  // Add transition class to all book items
  const bookItems = document.querySelectorAll('.book-item');
  bookItems.forEach(item => {
    item.classList.add('transitioning');
  });

  // Update toggle button state
  viewModeToggle.classList.toggle('grid', mode === 'cover');

  // Save mode preference
  localStorage.setItem('viewMode', mode);

  // Apply view mode changes with animation timing
  setTimeout(() => {
    bookGrids.forEach(grid => {
      grid.classList.remove('grid-view', 'cover-view');
      grid.classList.add(`${mode}-view`);
    });

    setTimeout(() => {
      bookItems.forEach(item => {
        item.classList.remove('transitioning');
      });
      attachBookCoverHandlers();
    }, 400);
  }, 50);
};

/**
    * Initializes view mode toggle functionality
    * Manages transitions between grid and cover views
    */
const initializeViewModeToggle = () => {
  const viewModeToggle = document.getElementById('viewModeToggle');
  if (!viewModeToggle) return;

  let isTransitioning = false;

  viewModeToggle.addEventListener('click', () => {
    // Prevent multiple transitions at once
    if (isTransitioning) return;

    isTransitioning = true;
    const currentMode = localStorage.getItem('viewMode') || 'grid';
    const newMode = currentMode === 'grid' ? 'cover' : 'grid';

    // Add animation class during transition
    document.querySelectorAll('.book-grid').forEach(grid => {
      grid.classList.add('animating');
    });

    setViewMode(newMode);

    // Remove animation class after transition
    setTimeout(() => {
      document.querySelectorAll('.book-grid').forEach(grid => {
        grid.classList.remove('animating');
      });
      isTransitioning = false;
    }, 450);
  });

  // Apply saved view mode on initialization
  const savedViewMode = localStorage.getItem('viewMode') || 'grid';
  setViewMode(savedViewMode);
};

// Initialize view mode toggle on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initializeViewModeToggle();

  // Handle window resize events with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentMode = localStorage.getItem('viewMode') || 'grid';
      setViewMode(currentMode);
    }, 100);
  });
});

/**
  * Opens image modal for book cover preview
  * @param {Event} e - Click event on book cover
  */
function openImageModal(e) {
  e.preventDefault();
  e.stopPropagation();
  const bookCover = e.currentTarget;
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalBookCover');

  modalImage.src = bookCover.src;
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}

/**
  * Closes image preview modal
  */
function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// Setup image modal event handlers on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const closeImageModalButton = document.getElementById('closeImageModal');
  if (closeImageModalButton) {
    closeImageModalButton.addEventListener('click', closeImageModal);
  }

  // Close modal when clicking outside the imag
  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    imageModal.addEventListener('click', function (event) {
      if (event.target === imageModal) {
        closeImageModal();
      }
    });
  }
});

/**
  * Attaches click handlers to all book covers
  * Replaces existing covers with new ones to prevent event duplication
  */
function attachBookCoverHandlers() {
  const bookCovers = document.querySelectorAll('.book-cover');
  bookCovers.forEach(cover => {
    const clone = cover.cloneNode(true);
    cover.parentNode.replaceChild(clone, cover);
    // Clone and replace to remove old event listeners
    clone.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageModal(e);
    });
    clone.style.cursor = 'pointer';
  });
}

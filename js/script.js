document.addEventListener("DOMContentLoaded", async () => {
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

  let books = [];

  // Retrieve books from localStorage
  const storedBooks = localStorage.getItem("books");

  try {
    books = storedBooks ? JSON.parse(storedBooks) : [];
  } catch (error) {
    console.error("Error parsing books from localStorage:", error);
    books = [];
  }

  // Check if books array is empty or invalid
  if (!Array.isArray(books) || books.length === 0) {
    books = defaultBooks; // Use default books from bookData.js
    localStorage.setItem("books", JSON.stringify(books)); // Save to localStorage
  }

  const bookForm = document.getElementById("bookForm");
  const searchInput = document.getElementById("searchBookTitle");
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");
  const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
  const submitButton = document.getElementById("bookFormSubmit");

  const updateSubmitButton = () => {
    const isChecked = isCompleteCheckbox.checked;
    submitButton.innerHTML = isChecked
      ? 'Masukkan Buku ke rak <span>Selesai dibaca</span>'
      : 'Masukkan Buku ke rak <span>Blm. selesai dibaca</span>';
  };

  isCompleteCheckbox.addEventListener("change", updateSubmitButton);
  updateSubmitButton();

  const generateId = () => Date.now().toString();

  const saveBooks = () => {
    localStorage.setItem("books", JSON.stringify(books));
  };

  const createBookElement = (book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book-item";
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    if (book.cover) {
      const coverImg = document.createElement("img");
      coverImg.src = book.cover;
      coverImg.className = "book-cover";
      coverImg.alt = `Cover ${book.title}`;
      coverImg.addEventListener('click', openImageModal);
      coverImg.addEventListener('click', (e) => {
        e.stopPropagation();
        openImageModal(e);
      });
      bookElement.appendChild(coverImg);
    }

    bookElement.innerHTML += `
      <div class="book-content">
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">${book.author}</p>
        <p data-testid="bookItemYear">${book.year}</p>
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

    const menuToggle = bookElement.querySelector(".book-menu-toggle");
    const actionsMenu = bookElement.querySelector(".book-actions");
    // Remove old event listener if exists
    const menuToggleHandler = (e) => {
      e.stopPropagation();
      document.querySelectorAll('.book-item').forEach(item => {
        if (item !== bookElement) {
          item.classList.remove('menu-open');
          item.querySelector('.book-actions')?.classList.remove('show');
        }
      });
      actionsMenu.classList.toggle("show");
      bookElement.classList.toggle("menu-open");
    };

    menuToggle.removeEventListener("click", menuToggleHandler);
    menuToggle.addEventListener("click", menuToggleHandler);
    menuToggle.style.pointerEvents = 'auto'; // Ensure clickable

    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');

    completeButton.onclick = () => {
      actionsMenu.classList.remove("show");
      bookElement.classList.remove("menu-open");
      toggleBookComplete(book.id);
    };
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

  document.addEventListener('click', (e) => {
    const menus = document.querySelectorAll('.book-actions.show');
    const menuToggles = document.querySelectorAll('.book-menu-toggle');
    
    if (!e.target.closest('.book-actions') && !e.target.closest('.book-menu-toggle')) {
      menus.forEach(menu => {
        menu.classList.remove('show');
        menu.closest('.book-item').classList.remove('menu-open');
      });
    }
  });

  const renderBooks = (filteredBooks = books) => {
    const currentViewMode = localStorage.getItem('viewMode') || 'grid';
    const bookGrids = document.querySelectorAll('.book-grid');
    const currentGridClasses = Array.from(bookGrids[0]?.classList || [])
      .filter(className => className.includes('-view'));

    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    document.querySelectorAll('.view-all-button').forEach(button => button.remove());

    function createViewAllButton() {
      const button = document.createElement("button");
      button.className = "view-all-button";
      button.textContent = "Lihat Semua";
      return button;
    }
    
    const incompleteViewAll = createViewAllButton();
    const completeViewAll = createViewAllButton();

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeList.appendChild(bookElement);
      } else {
        incompleteList.appendChild(bookElement);
      }
    });

    const applyCollapse = (list, button) => {
      const isDesktop = window.innerWidth >= 769;
      const threshold = isDesktop ? 6 : 3;
      if (list.children.length > threshold) {
        list.classList.add('collapsed');
        button.classList.add('visible');
        list.parentElement.appendChild(button);

        button.addEventListener('click', () => {
          list.classList.toggle('collapsed');
          button.textContent = list.classList.contains('collapsed') ? 'Lihat Semua' : 'Lihat Sedikit';
        });
      } else {
        list.classList.remove('collapsed');
      }
    };

    applyCollapse(incompleteList, incompleteViewAll);
    applyCollapse(completeList, completeViewAll);

    const newBookGrids = document.querySelectorAll('.book-grid');
    newBookGrids.forEach(grid => {
      grid.classList.remove('grid-view', 'cover-view');
      grid.classList.add(`${currentViewMode}-view`);
    });

    const viewModeToggle = document.getElementById('viewModeToggle');
    viewModeToggle.classList.toggle('grid', currentViewMode === 'cover');

    attachBookCoverHandlers();
  };

  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    const isDesktop = currentWidth >= 769;
    const wasDesktop = lastWidth >= 769;
    if (isDesktop !== wasDesktop) {
      location.reload();
    }
    lastWidth = currentWidth;
  });

  const addBookModal = document.getElementById("addBookModal");
  const showAddBookBtn = document.getElementById("showAddBook");
  const closeAddBookBtn = document.getElementById("closeAddBook");

  const toggleAddBookModal = () => {
    addBookModal.style.display = addBookModal.style.display === "block" ? "none" : "block";
  };

  showAddBookBtn.addEventListener("click", toggleAddBookModal);
  closeAddBookBtn.addEventListener("click", toggleAddBookModal);

  window.addEventListener("click", (e) => {
    if (e.target === addBookModal) {
      toggleAddBookModal();
    }
  });

  let cropper = null;
  let currentCropInput = null;

  const initCropper = (image, aspectRatio = 2/3) => {
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
        
        // Initialize cropper after image is loaded
        cropImage.addEventListener('load', () => {
          initCropper(cropImage);
        }, { once: true });
        
        currentCropInput = input;
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Update file input event listeners
  document.getElementById('bookFormCover').addEventListener('change', (e) => {
    handleImageSelect(e.target);
  });

  document.getElementById('editFormCover').addEventListener('change', (e) => {
    handleImageSelect(e.target);
  });

  // Add crop modal button handlers
  document.getElementById('cancelCrop').addEventListener('click', () => {
    const cropModal = document.getElementById('cropModal');
    cropModal.style.display = 'none';
    document.body.classList.remove('modal-open');
    if (currentCropInput) {
      currentCropInput.value = '';
      currentCropInput = null;
    }
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  });

  document.getElementById('applyCrop').addEventListener('click', () => {
    if (cropper && currentCropInput) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 600,    // Set a good default width
        height: 900,   // Maintain 2:3 ratio
      });
      
      const croppedImage = croppedCanvas.toDataURL('image/jpeg', 0.9);
      currentCropInput.dataset.croppedImage = croppedImage;
      
      // Enable preview button
      const previewBtn = currentCropInput.id === 'bookFormCover' ? 
        document.getElementById('previewCoverBtn') : 
        document.getElementById('previewEditCoverBtn');
      previewBtn.disabled = false;
      
      // Close modal and cleanup
      const cropModal = document.getElementById('cropModal');
      cropModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      cropper.destroy();
      cropper = null;
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
    const coverInput = document.getElementById("bookFormCover");
    
    let coverUrl = null;
    if (coverInput.dataset.croppedImage) {
      coverUrl = coverInput.dataset.croppedImage;
      const newBook = {
        id: generateId(),
        title,
        author,
        year,
        isComplete,
        cover: coverUrl
      };
      
      books.push(newBook);
      saveBooks();
      renderBooks();
      toggleAddBookModal();
      event.target.reset();
      updateSubmitButton(false);
    } else {
      let coverUrl = null;
      if (coverInput.files && coverInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          coverUrl = e.target.result;
          const newBook = {
            id: generateId(),
            title,
            author,
            year,
            isComplete,
            cover: coverUrl
          };
          
          books.push(newBook);
          saveBooks();
          renderBooks();
          toggleAddBookModal();
          event.target.reset();
          updateSubmitButton(false);
        };
        reader.readAsDataURL(coverInput.files[0]);
      } else {
        const newBook = {
          id: generateId(),
          title,
          author,
          year,
          isComplete,
          cover: null
        };
        
        books.push(newBook);
        saveBooks();
        renderBooks();
        toggleAddBookModal();
        event.target.reset();
        updateSubmitButton(false);
      }
    }
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
    const coverInput = document.getElementById("editFormCover");
    
    if (coverInput.dataset.croppedImage) {
      const updatedBook = {
        ...book,
        title: editFormTitle.value,
        author: editFormAuthor.value,
        year: parseInt(editFormYear.value),
        cover: coverInput.dataset.croppedImage
      };
      
      books = books.map((b) =>
        b.id === editingBookId ? updatedBook : b
      );
      saveBooks();
      renderBooks();
      hideEditForm();
    } else {
      if (coverInput.files && coverInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const updatedBook = {
            ...book,
            title: editFormTitle.value,
            author: editFormAuthor.value,
            year: parseInt(editFormYear.value),
            cover: e.target.result
          };
          
          books = books.map((b) =>
            b.id === editingBookId ? updatedBook : b
          );
          saveBooks();
          renderBooks();
          hideEditForm();
        };
        reader.readAsDataURL(coverInput.files[0]);
      } else {
        const updatedBook = {
          ...book,
          title: editFormTitle.value,
          author: editFormAuthor.value,
          year: parseInt(editFormYear.value)
        };
        
        books = books.map((b) =>
          b.id === editingBookId ? updatedBook : b
        );
        saveBooks();
        renderBooks();
        hideEditForm();
      }
    }
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

  // Add preview functionality
  const setupImagePreview = (inputId, previewBtnId) => {
    const input = document.getElementById(inputId);
    const previewBtn = document.getElementById(previewBtnId);
    
    input.addEventListener('change', () => {
      previewBtn.disabled = true; // Will be enabled after cropping
    });
    
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
  
  // Setup preview for add book form
  setupImagePreview('bookFormCover', 'previewCoverBtn');
  
  // Setup preview for edit book form
  setupImagePreview('editFormCover', 'previewEditCoverBtn');
  
  attachBookCoverHandlers();
});

const setViewMode = (mode) => {
  const bookGrids = document.querySelectorAll('.book-grid');
  const currentMode = localStorage.getItem('viewMode') || 'grid';
  
  // If same mode, no need to animate
  if (mode === currentMode) return;
  
  // Prevent interaction during transition
  bookGrids.forEach(grid => {
    // Add transition class to grid
    grid.style.pointerEvents = 'none';
    
    // Mark all items as transitioning with specific transition class
    let bookItems = grid.querySelectorAll('.book-item');
    bookItems.forEach(item => {
      item.classList.add('transitioning');
      // Add specific transition class based on target mode
      item.classList.add(`transitioning-to-${mode}`);
    });
    
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      // Change view mode
      grid.classList.remove('grid-view', 'cover-view');
      grid.classList.add(`${mode}-view`);
      
      // Re-query DOM for updated items
      // bookItems = grid.querySelectorAll('.book-item');
      // bookItems.forEach(item => {
      //   const menuToggle = item.querySelector('.book-menu-toggle');
      //   if (menuToggle) menuToggle.style.pointerEvents = 'auto';
      // });
      
      // After transition completes
      const onTransitionEnd = (e) => {
        if (e.target === grid) {
          // Remove all transition classes
          bookItems.forEach(item => {
            item.classList.remove('transitioning');
            item.classList.remove('transitioning-to-grid');
            item.classList.remove('transitioning-to-cover');
          });

          // Re-attach event listeners after transition
          const covers = grid.querySelectorAll('.book-cover');
          covers.forEach(cover => {
            cover.removeEventListener('click', openImageModal);
            cover.addEventListener('click', (e) => {
              e.stopPropagation();
              openImageModal(e);
            });
          });
          
          // Ensure menu toggles are clickable
          bookItems.forEach(item => {
            const menuToggle = item.querySelector('.book-menu-toggle');
            if (menuToggle) menuToggle.style.pointerEvents = 'auto';
          });
          
          attachBookCoverHandlers();
          
          // Re-enable interactions
          grid.style.pointerEvents = '';
          
          // Remove event listener
          grid.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      
      // Listen for transition completion
      grid.addEventListener('transitionend', onTransitionEnd);
    });
  });
  
  // Update toggle button state
  const viewModeToggle = document.getElementById('viewModeToggle');
  viewModeToggle.classList.toggle('grid', mode === 'cover');
  
  // Save preference
  localStorage.setItem('viewMode', mode);
};

// Optimize view mode toggle handler
const initializeViewModeToggle = () => {
  const viewModeToggle = document.getElementById('viewModeToggle');
  if (!viewModeToggle) return;

  // Debounce view mode changes
  let isTransitioning = false;
  
  viewModeToggle.addEventListener('click', () => {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const currentMode = localStorage.getItem('viewMode') || 'grid';
    const newMode = currentMode === 'grid' ? 'cover' : 'grid';
    
    setViewMode(newMode);
    
    // Reset transition lock after animation
    setTimeout(() => {
      isTransitioning = false;
    }, 350); // Slightly longer than transition duration
  });
  
  // Set initial view mode
  const savedViewMode = localStorage.getItem('viewMode') || 'grid';
  setViewMode(savedViewMode);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeViewModeToggle();
  
  // Optional: Reset transition states on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentMode = localStorage.getItem('viewMode') || 'grid';
      setViewMode(currentMode);
    }, 100);
  });
});

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

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeImageModalButton = document.getElementById('closeImageModal');
  if (closeImageModalButton) {
    closeImageModalButton.addEventListener('click', closeImageModal);
  }

  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    imageModal.addEventListener('click', function(event) {
      if (event.target === imageModal) {
        closeImageModal();
      }
    });
  }
});

function attachBookCoverHandlers() {
  const bookCovers = document.querySelectorAll('.book-cover');
  bookCovers.forEach(cover => {
    cover.removeEventListener('click', openImageModal);
    cover.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageModal(e);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => { 
  const listBtn = document.getElementById('listViewBtn');
  const gridBtn = document.getElementById('gridViewBtn');
  const listView = document.getElementById('list-th');
  const gridView = document.getElementById('large-th');
  const themeToggle = document.getElementById('theme-toggle');

  // Dark mode toggle
  if (themeToggle) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
      themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // View toggle for main books
  listBtn.addEventListener('click', e => {
    e.preventDefault();
    listView.classList.add('active');
    gridView.classList.remove('active');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  });
  gridBtn.addEventListener('click', e => {
    e.preventDefault();
    gridView.classList.add('active');
    listView.classList.remove('active');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  });

  // View toggle for Genre Books
const genreListBtn = document.getElementById('genreListViewBtn');
const genreGridBtn = document.getElementById('genreGridViewBtn');
const genreListView = document.getElementById('genre-list-th');
const genreGridView = document.getElementById('genre-large-th');

if (genreListBtn && genreGridBtn && genreListView && genreGridView) {
  genreListBtn.addEventListener('click', e => {
    e.preventDefault();
    genreListView.classList.add('active');
    genreGridView.classList.remove('active');
    genreListBtn.classList.add('active');
    genreGridBtn.classList.remove('active');
  });

  genreGridBtn.addEventListener('click', e => {
    e.preventDefault();
    genreGridView.classList.add('active');
    genreListView.classList.remove('active');
    genreGridBtn.classList.add('active');
    genreListBtn.classList.remove('active');
  });
}


  // View toggle for Top Books
  const topListBtn = document.getElementById('topListViewBtn');
  const topGridBtn = document.getElementById('topGridViewBtn');
  const topListView = document.getElementById('genre-list');
  const topGridView = document.getElementById('genre-grid');

  topListBtn.addEventListener('click', e => {
    e.preventDefault();
    topListView.classList.add('active');
    topGridView.classList.remove('active');
    topListBtn.classList.add('active');
    topGridBtn.classList.remove('active');
  });
  topGridBtn.addEventListener('click', e => {
    e.preventDefault();
    topGridView.classList.add('active');
    topListView.classList.remove('active');
    topGridBtn.classList.add('active');
    topListBtn.classList.remove('active');
  });

  // Initialize galleries
  new BookGallery();
  new GenreGallery();
  new TopBooksGallery();
  new BookModal();

  // Contact form submission handler
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      console.log('Contact Form Submitted:', { name, email, subject, message });

      alert(`Thank you, ${name}! Your message has been sent.`);

      contactForm.reset();
    });
  }
document.getElementById('search-icon')?.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.getElementById('search-books-section');
  const yOffset = -80; 
  const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
});

});

class BookModal {
  constructor() {
    this.modal = document.getElementById('book-modal');
    this.closeBtn = document.getElementById('close-modal');
    this.modalTitle = document.getElementById('modal-book-title');
    this.modalCover = document.getElementById('modal-book-cover');
    this.modalAuthor = document.getElementById('modal-book-author');
    this.modalInfo = document.getElementById('modal-book-info');
    this.modalDescription = document.getElementById('modal-book-description');

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close modal events
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  async showBookDetails(book) {
    if (!this.modal) return;
    
    // Show modal immediately with basic info
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set basic information
    const title = book.title || 'Untitled';
    let author = 'Unknown Author';
    if (book.authors && book.authors.length > 0) {
      author = book.authors.map(a => a.name).join(', ');
    } else if (book.author_name && book.author_name.length > 0) {
      author = book.author_name.join(', ');
    }

    const coverUrl = book.cover_id
      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
      : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`;

    this.modalTitle.textContent = title;
    this.modalCover.src = coverUrl;
    this.modalCover.alt = title;
    this.modalAuthor.textContent = `by ${author}`;

    // Set basic info
    this.modalInfo.innerHTML = `
      <div class="info-item">
        <div class="info-label">First Published</div>
        <div class="info-value">${book.first_publish_year || 'Unknown'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Subjects</div>
        <div class="info-value">${book.subject ? book.subject.slice(0, 3).join(', ') : 'Various'}</div>
      </div>
    `;

    // Show loading state for description
    this.modalDescription.innerHTML = '<span class="loading-spinner"></span> Loading book details...';

    // Fetch detailed information
    try {
      await this.fetchBookDetails(book);
    } catch (error) {
      console.error('Error fetching book details:', error);
      this.modalDescription.innerHTML = '<p>Unable to load detailed description at this time.</p>';
    }
  }

  async fetchBookDetails(book) {
    try {
      let bookKey = null;
      
      // Try to get book key from the work
      if (book.key) {
        bookKey = book.key;
      } else if (book.cover_edition_key) {
        bookKey = `/books/${book.cover_edition_key}`;
      }

      if (!bookKey) {
        throw new Error('No book key available');
      }

      // Fetch book details
      const response = await fetch(`https://openlibrary.org${bookKey}.json`);
      if (!response.ok) throw new Error('Failed to fetch book details');
      
      const bookData = await response.json();
      
      // Try to get description
      let description = 'No description available.';
      if (bookData.description) {
        if (typeof bookData.description === 'string') {
          description = bookData.description;
        } else if (bookData.description.value) {
          description = bookData.description.value;
        }
      }

      // Update modal with detailed information
      this.modalDescription.innerHTML = `
        <h3>Description</h3>
        <p>${this.formatDescription(description)}</p>
        ${bookData.isbn_13 ? `
          <h3>Additional Information</h3>
          <div class="info-item">
            <div class="info-label">ISBN-13</div>
            <div class="info-value">${bookData.isbn_13[0]}</div>
          </div>
        ` : ''}
        ${bookData.number_of_pages ? `
          <div class="info-item">
            <div class="info-label">Pages</div>
            <div class="info-value">${bookData.number_of_pages}</div>
          </div>
        ` : ''}
      `;

    } catch (error) {
      console.error('Error in fetchBookDetails:', error);
      
      // Fallback: try to use basic information from the original book object
      let fallbackDescription = 'This book is part of our collection. ';
      if (book.subject && book.subject.length > 0) {
        fallbackDescription += `It covers topics such as ${book.subject.slice(0, 5).join(', ')}.`;
      }
      if (book.first_publish_year) {
        fallbackDescription += ` First published in ${book.first_publish_year}.`;
      }

      this.modalDescription.innerHTML = `
        <h3>About this Book</h3>
        <p>${fallbackDescription}</p>
        <p><em>Detailed description unavailable.</em></p>
      `;
    }
  }

  formatDescription(description) {
    // Clean up description text
    let cleaned = description.replace(/\n/g, '</p><p>');
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    cleaned = cleaned.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Limit length if too long
    if (cleaned.length > 1000) {
      cleaned = cleaned.substring(0, 997) + '...';
    }
    
    return cleaned;
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

class BookGallery {
  constructor() {
    this.grid = document.getElementById('book-grid');
    this.list = document.getElementById('book-list');
    this.prevBtn = document.getElementById('book-prev-1');
    this.nextBtn = document.getElementById('book-next-1');
    this.books = [];
    this.currentPage = 0;
    this.booksPerPage = 9;
    this.bookModal = null;

    this.prevBtn?.addEventListener('click', () => this.changePage(-1));
    this.nextBtn?.addEventListener('click', () => this.changePage(1));

    this.fetchTrendingBooks();
  }

  setBookModal(bookModal) {
    this.bookModal = bookModal;
  }

  async fetchTrendingBooks() {
    try {
      const res = await fetch('https://openlibrary.org/trending/daily.json');
      if (!res.ok) throw new Error('Failed to fetch trending books');

      const data = await res.json();
      const nowYear = new Date().getFullYear();

      this.books = (data.works || []).filter(book => {
        const hasCover = book.cover_id || book.cover_edition_key;
        const firstPublishYear = book.first_publish_year || 0;
        return hasCover && firstPublishYear >= 2018;
      }).slice(0, 32);

      if (!this.books.length) throw new Error('No recent trending books with covers found');
      this.renderBooks();
    } catch (err) {
      console.error(err);
      this.grid.innerHTML = '<li style="color:red;">Could not load trending books.</li>';
      this.list.innerHTML = '';
    }
  }

  changePage(offset) {
    const newPage = this.currentPage + offset;
    const maxPage = Math.ceil(this.books.length / this.booksPerPage) - 1;
    if (newPage >= 0 && newPage <= maxPage) {
      this.currentPage = newPage;
      this.renderBooks();
    }
  }

  addBookClickHandlers() {
    // Add click handlers for grid view
    this.grid.querySelectorAll('.chapter-card').forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const bookIndex = this.currentPage * this.booksPerPage + index;
        const book = this.books[bookIndex];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });

    // Add click handlers for list view
    this.list.querySelectorAll('.book').forEach((bookEl, index) => {
      bookEl.style.cursor = 'pointer';
      bookEl.addEventListener('click', () => {
        const bookIndex = this.currentPage * this.booksPerPage + index;
        const book = this.books[bookIndex];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });
  }

  renderBooks() {
    const start = this.currentPage * this.booksPerPage;
    const booksToShow = this.books.slice(start, start + this.booksPerPage);

    this.grid.innerHTML = booksToShow.map(book => {
      let title = book.title || 'Untitled';
      let author = 'Unknown Author';
      if (book.authors && book.authors.length > 0) {
        author = book.authors.map(a => a.name).join(', ');
      } else if (book.author_name && book.author_name.length > 0) {
        author = book.author_name.join(', ');
      }

      let coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`;

      return `
        <li>
          <article class="chapter-card">
            <img src="${coverUrl}" alt="${title}" class="book-cover" />
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${author}</p>
          </article>
        </li>`;
    }).join('');

    this.list.innerHTML = booksToShow.map(book => {
      let title = book.title || 'Untitled';
      let author = 'Unknown Author';
      if (book.authors && book.authors.length > 0) {
        author = book.authors.map(a => a.name).join(', ');
      } else if (book.author_name && book.author_name.length > 0) {
        author = book.author_name.join(', ');
      }

      let coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
        : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;

      return `
        <div class="book read">
          <div class="cover">
            <img src="${coverUrl}" alt="${title}" />
          </div>
          <div class="description">
            <p class="title">${title}<br>
              <span class="author">${author}</span>
            </p>
          </div>
        </div>`;
    }).join('');

    // Add click handlers after rendering
    setTimeout(() => this.addBookClickHandlers(), 100);
  }
}

class GenreGallery {
  constructor() {
    this.genreSelect = document.getElementById('genre-select');
    this.genreGrid = document.getElementById('genre-grid');
    this.genreList = document.getElementById('genre-list');
    this.loader = document.getElementById('genre-loading');
    this.prevBtn = document.getElementById('book-prev-2');
    this.nextBtn = document.getElementById('book-next-2');

    this.books = [];
    this.currentPage = 0;
    this.booksPerPage = 9;

    // Genre mapping for better API calls
    this.genreMapping = {
      'contemporary_romance': 'romance',
      'historical_romance': 'historical_fiction',
      'paranormal_romance': 'fantasy',
      'romantic_comedy': 'humor',
      'literary_fiction': 'literature',
      'self_help': 'self-help',
      'mental_health': 'psychology',
      'computer_science': 'programming',
      'cultural_studies': 'anthropology',
      'bedtime_stories': 'children',
      'picture_books': 'children',
      'educational_children': 'children',
      'fitness': 'health',
      'meditation': 'philosophy',
      'supernatural': 'horror',
      'gothic': 'horror',
      'paranormal': 'horror',
      'satire': 'humor',
      'entertainment': 'humor',
      'environment': 'science',
      'pets': 'animals'
    };

    this.prevBtn.addEventListener('click', () => this.changePage(-1));
    this.nextBtn.addEventListener('click', () => this.changePage(1));

    if (this.genreSelect) {
      this.genreSelect.addEventListener('change', () => {
        if (this.genreSelect.value) {
          this.fetchGenreBooks(this.genreSelect.value);
        }
      });

      if (this.genreSelect.value) {
        this.fetchGenreBooks(this.genreSelect.value);
      }
    }
  }

  async fetchGenreBooks(genre) {
    this.loader.style.display = 'block';
    this.genreGrid.innerHTML = '';
    this.genreList.innerHTML = '';
    this.currentPage = 0;

    try {
      // Use mapped genre if available, otherwise use original
      const apiGenre = this.genreMapping[genre] || genre;
      
      // Special handling for specific genres
      let books = [];
      
      if (genre === 'contemporary_romance') {
        books = await this.fetchContemporaryRomance();
      } else if (genre === 'religion') {
        books = await this.fetchReligionBooks();
      } else if (genre === 'poetry') {
        books = await this.fetchPoetryBooks();
      } else if (genre.includes('romance') && genre !== 'romance') {
        books = await this.fetchSpecificRomance(genre);
      } else {
        // Standard Open Library API call
        const res = await fetch(`https://openlibrary.org/subjects/${apiGenre}.json?limit=32`);
        if (!res.ok) throw new Error('Failed to fetch genre books');
        const data = await res.json();
        books = data.works || [];
      }

      this.books = books.filter(book => book.cover_id || book.cover_edition_key);

      if (this.books.length === 0) {
        this.genreGrid.innerHTML = '<li style="color:red;">No books found for this genre.</li>';
        this.genreList.innerHTML = '';
        this.loader.style.display = 'none';
        return;
      }

      this.renderBooks();
    } catch (err) {
      console.error(err);
      this.genreGrid.innerHTML = '<li style="color:red;">Could not load genre books.</li>';
      this.genreList.innerHTML = '';
    } finally {
      this.loader.style.display = 'none';
    }
  }

  async fetchContemporaryRomance() {
    try {
      // Fetch from multiple romance-related subjects
      const subjects = ['romance', 'love_stories', 'contemporary_fiction'];
      const allBooks = [];

      for (const subject of subjects) {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=15`);
        if (res.ok) {
          const data = await res.json();
          if (data.works) {
            // Filter for more recent books (contemporary)
            const contemporaryBooks = data.works.filter(book => {
              const year = book.first_publish_year || 0;
              return year >= 1990; // Contemporary = 1990 onwards
            });
            allBooks.push(...contemporaryBooks);
          }
        }
      }

      // Remove duplicates and return
      return this.removeDuplicates(allBooks);
    } catch (error) {
      console.error('Error fetching contemporary romance:', error);
      return [];
    }
  }

  async fetchReligionBooks() {
    try {
      const subjects = ['religion', 'christianity', 'islam', 'buddhism', 'spirituality', 'theology'];
      const allBooks = [];

      for (const subject of subjects) {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
        if (res.ok) {
          const data = await res.json();
          if (data.works) {
            allBooks.push(...data.works);
          }
        }
      }

      return this.removeDuplicates(allBooks);
    } catch (error) {
      console.error('Error fetching religion books:', error);
      return [];
    }
  }

  async fetchPoetryBooks() {
    try {
      const subjects = ['poetry', 'poems', 'american_poetry', 'english_poetry', 'modern_poetry'];
      const allBooks = [];

      for (const subject of subjects) {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
        if (res.ok) {
          const data = await res.json();
          if (data.works) {
            allBooks.push(...data.works);
          }
        }
      }

      return this.removeDuplicates(allBooks);
    } catch (error) {
      console.error('Error fetching poetry books:', error);
      return [];
    }
  }

  async fetchSpecificRomance(genreType) {
    try {
      let subjects = [];
      
      switch (genreType) {
        case 'historical_romance':
          subjects = ['historical_fiction', 'romance', 'regency'];
          break;
        case 'paranormal_romance':
          subjects = ['fantasy', 'romance', 'paranormal'];
          break;
        case 'romantic_comedy':
          subjects = ['humor', 'romance', 'comedy'];
          break;
        default:
          subjects = ['romance'];
      }

      const allBooks = [];
      for (const subject of subjects) {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
        if (res.ok) {
          const data = await res.json();
          if (data.works) {
            allBooks.push(...data.works);
          }
        }
      }

      return this.removeDuplicates(allBooks);
    } catch (error) {
      console.error('Error fetching specific romance:', error);
      return [];
    }
  }

  removeDuplicates(books) {
    const seen = new Set();
    return books.filter(book => {
      const key = `${book.title?.toLowerCase()}-${book.authors?.[0]?.name?.toLowerCase() || ''}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  changePage(offset) {
    const newPage = this.currentPage + offset;
    const maxPage = Math.ceil(this.books.length / this.booksPerPage) - 1;
    if (newPage >= 0 && newPage <= maxPage) {
      this.currentPage = newPage;
      this.renderBooks();
    }
  }

  addBookClickHandlers() {
    // Add click handlers for grid view
    this.genreGrid.querySelectorAll('.chapter-card').forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const bookIndex = this.currentPage * this.booksPerPage + index;
        const book = this.books[bookIndex];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });

    // Add click handlers for list view
    this.genreList.querySelectorAll('.book').forEach((bookEl, index) => {
      bookEl.style.cursor = 'pointer';
      bookEl.addEventListener('click', () => {
        const bookIndex = this.currentPage * this.booksPerPage + index;
        const book = this.books[bookIndex];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });
  }
  
  renderBooks() {
    const start = this.currentPage * this.booksPerPage;
    const booksToShow = this.books.slice(start, start + this.booksPerPage);

    this.genreGrid.innerHTML = booksToShow.map(book => {
      const title = book.title || 'Untitled';
      const author = (book.authors || []).map(a => a.name).join(', ') || 'Unknown Author';
      const coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`;

      return `
        <li>
          <article class="chapter-card">
            <img src="${coverUrl}" alt="${title}" class="book-cover" loading="lazy" />
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${author}</p>
            ${book.first_publish_year ? `<p class="publish-year">${book.first_publish_year}</p>` : ''}
          </article>
        </li>`;
    }).join('');

    this.genreList.innerHTML = booksToShow.map(book => {
      const title = book.title || 'Untitled';
      const author = (book.authors || []).map(a => a.name).join(', ') || 'Unknown Author';
      const coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
        : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;

      return `
        <div class="book read">
          <div class="cover">
            <img src="${coverUrl}" alt="${title}" loading="lazy" />
          </div>
          <div class="description">
            <p class="title">${title}<br>
              <span class="author">${author}</span>
              ${book.first_publish_year ? `<br><span class="year">${book.first_publish_year}</span>` : ''}
            </p>
          </div>
        </div>`;
    }).join('');

    // Add click handlers after rendering
    setTimeout(() => this.addBookClickHandlers(), 100);
  }
}
class TopBooksGallery {
  constructor() {
    this.grid = document.getElementById('top-book-grid');
    this.list = document.getElementById('top-book-list');
    this.prevBtn = document.getElementById('book-prev-3');
    this.nextBtn = document.getElementById('book-next-3');
    this.books = [];
    this.currentPage = 0;
    this.booksPerPage = 9;

    this.prevBtn?.addEventListener('click', () => this.changePage(-1));
    this.nextBtn?.addEventListener('click', () => this.changePage(1));

    this.fetchTrendingBooks();
  }

  async fetchTrendingBooks() {
    try {
      const res = await fetch('https://openlibrary.org/trending/alltime.json');
      if (!res.ok) throw new Error('Failed to fetch trending books');

      const data = await res.json();
      const nowYear = new Date().getFullYear();

      this.books = (data.works || []).filter(book => {
        const hasCover = book.cover_id || book.cover_edition_key;
        const firstPublishYear = book.first_publish_year || 0;
        return hasCover && firstPublishYear >= 2018;
      }).slice(0, 32);

      if (!this.books.length) throw new Error('No recent trending books with covers found');
      this.renderBooks();
    } catch (err) {
      console.error(err);
      this.grid.innerHTML = '<li style="color:red;">Could not load trending books.</li>';
      this.list.innerHTML = '';
    }
  }

  changePage(offset) {
    const newPage = this.currentPage + offset;
    const maxPage = Math.ceil(this.books.length / this.booksPerPage) - 1;
    if (newPage >= 0 && newPage <= maxPage) {
      this.currentPage = newPage;
      this.renderBooks();
    }
  }

  addBookClickHandlers() {
    // Add click handlers for grid view
    this.grid.querySelectorAll('.chapter-card').forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const bookIndex = this.currentPage * this.booksPerPage + index;
        const book = this.books[bookIndex];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });

    // Add click handlers for list view
    this.list.querySelectorAll('.book').forEach((bookEl, index) => {
      bookEl.style.cursor = 'pointer';
      bookEl.addEventListener('click', () => {
        const bookIndex = this.currentPage * this.booksPerPage + index;
        const book = this.books[bookIndex];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });
  }

  renderBooks() {
    const start = this.currentPage * this.booksPerPage;
    const booksToShow = this.books.slice(start, start + this.booksPerPage);

    this.grid.innerHTML = booksToShow.map(book => {
      let title = book.title || 'Untitled';
      let author = 'Unknown Author';
      if (book.authors && book.authors.length > 0) {
        author = book.authors.map(a => a.name).join(', ');
      } else if (book.author_name && book.author_name.length > 0) {
        author = book.author_name.join(', ');
      }

      let coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`;

      return `
        <li>
          <article class="chapter-card">
            <img src="${coverUrl}" alt="${title}" class="book-cover" />
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${author}</p>
          </article>
        </li>`;
    }).join('');

    this.list.innerHTML = booksToShow.map(book => {
      let title = book.title || 'Untitled';
      let author = 'Unknown Author';
      if (book.authors && book.authors.length > 0) {
        author = book.authors.map(a => a.name).join(', ');
      } else if (book.author_name && book.author_name.length > 0) {
        author = book.author_name.join(', ');
      }

      let coverUrl = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
        : `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;

      return `
        <div class="book read">
          <div class="cover">
            <img src="${coverUrl}" alt="${title}" />
          </div>
          <div class="description">
            <p class="title">${title}<br>
              <span class="author">${author}</span>
            </p>
          </div>
        </div>`;
    }).join('');

    // Add click handlers after rendering
    setTimeout(() => this.addBookClickHandlers(), 100);
  }
}

// Initialize the modal globally so all galleries can access it
window.addEventListener('DOMContentLoaded', () => {
  window.bookModal = new BookModal();
});

async function handleSearch(event) {
  event.preventDefault();
  const query = document.getElementById('book-search-input').value.trim();
  const resultsDiv = document.getElementById('search-results');
  resultsDiv.innerHTML = 'Searching...';

  if (!query) {
    resultsDiv.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.numFound === 0) {
      resultsDiv.innerHTML = '<p>No books found.</p>';
      return;
    }
     
    const books = data.docs
      .filter(book => book.cover_i)  // Only keep books with a real cover ID
      .slice(0, 5);                   // Then limit to the first 5


    // Render clickable results with a data attribute holding the index
    const html = books.map((book, index) => {
      const title = book.title || 'No title';
      const author = book.author_name ? book.author_name.join(', ') : 'Unknown author';
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : 'https://via.placeholder.com/100x150?text=No+Cover';

      return `
        <div class="d-flex mb-3 align-items-center search-result" data-index="${index}" style="cursor:pointer;">
          <img src="${coverUrl}" alt="Cover of ${title}" width="80" height="120" class="me-3" />
          <div>
            <h5>${title}</h5>
            <p>${author}</p>
          </div>
        </div>
      `;
    }).join('');

    resultsDiv.innerHTML = html;

    // Attach click handlers AFTER rendering results
    document.querySelectorAll('#search-results .search-result').forEach(el => {
      el.addEventListener('click', () => {
        const idx = el.getAttribute('data-index');
        const book = books[idx];
        if (book && window.bookModal) {
          window.bookModal.showBookDetails(book);
        }
      });
    });

  } catch (error) {
    resultsDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    console.error(error);
  }
}

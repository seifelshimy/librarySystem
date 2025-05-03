import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, reset } from '../features/books/bookSlice';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

function Books() {
  const dispatch = useDispatch();
  const { books, isLoading, isError, message } = useSelector(
    (state) => state.books
  );
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(getBooks());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  useEffect(() => {
    if (books) {
      let filtered = books;
      
      // Apply search filter
      filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.subgenre && book.subgenre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Apply genre filter
      if (selectedGenre !== 'All') {
        filtered = filtered.filter(book => book.genre === selectedGenre);
      }
      
      setFilteredBooks(filtered);
    }
  }, [books, searchTerm, selectedGenre]);

  // Get unique genres
  const uniqueGenres = books ? ['All', ...new Set(books.map(book => book.genre))].sort() : ['All'];

  // Group books by genre
  const booksByGenre = {};
  if (filteredBooks.length > 0) {
    if (selectedGenre === 'All') {
      uniqueGenres.forEach(genre => {
        if (genre !== 'All') {
          booksByGenre[genre] = filteredBooks.filter(book => book.genre === genre);
        }
      });
    } else {
      booksByGenre[selectedGenre] = filteredBooks;
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto pb-16 px-4 sm:pb-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
            Library
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Browse our Collection
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Find your next favorite book from our extensive collection
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-2/3">
            <div className="relative mt-1 flex items-center">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search for books by title, author, or genre"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <select
              id="genre-filter"
              name="genre-filter"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {uniqueGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No books found</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(booksByGenre).map(genre => (
              <div key={genre} className="mb-8">
                {selectedGenre === 'All' && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{genre}</h2>
                )}
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {booksByGenre[genre].map((book) => (
                    <div key={book._id} className="group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                        <img
                          src={
                            book.coverImage === 'no-image.jpg'
                              ? 'https://via.placeholder.com/150'
                              : book.coverImage
                          }
                          alt={book.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700">{book.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">by {book.author}</p>
                      <div className="mt-2 flex flex-col">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {book.genre}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              book.availableCopies > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {book.availableCopies > 0
                              ? `${book.availableCopies} Available`
                              : 'Not Available'}
                          </p>
                        </div>
                        {book.subgenre && (
                          <p className="text-xs text-gray-500">
                            {book.subgenre}
                          </p>
                        )}
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ${book.price ? book.price.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/books/${book._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>

                        {user && book.availableCopies > 0 && (
                          <Link
                            to={`/borrows/new?bookId=${book._id}`}
                            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Borrow
                          </Link>
                        )}
                        
                        {user && (
                          <button
                            onClick={() => window.alert(`You're about to buy "${book.title}" for $${book.price ? book.price.toFixed(2) : '0.00'}. This feature is coming soon!`)}
                            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Buy
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Books; 
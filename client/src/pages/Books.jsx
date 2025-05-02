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
      setFilteredBooks(
        books.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [books, searchTerm]);

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
        <div className="mb-8">
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

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {filteredBooks.map((book) => (
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
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">
                    Genre: {book.genre}
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
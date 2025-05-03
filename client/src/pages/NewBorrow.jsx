import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBook } from '../features/books/bookSlice';
import { createBorrow, reset } from '../features/borrows/borrowSlice';
import Spinner from '../components/Spinner';

function NewBorrow() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('bookId');
  const [errorMessage, setErrorMessage] = useState('');

  const { book, isLoading: bookLoading } = useSelector((state) => state.books);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.borrows
  );

  // Fetch book details
  useEffect(() => {
    if (bookId) {
      dispatch(getBook(bookId));
    } else {
      setErrorMessage('No book specified');
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    }
  }, [bookId, dispatch, navigate]);

  // Handle borrow response
  useEffect(() => {
    if (isError) {
      setErrorMessage(message || 'Failed to borrow book');
    }

    if (isSuccess) {
      setTimeout(() => {
        dispatch(reset());
        navigate('/borrows');
      }, 2000);
    }
  }, [dispatch, isError, isSuccess, message, navigate]);

  const onBorrow = () => {
    if (!bookId) {
      setErrorMessage('No book specified');
      return;
    }
    
    setErrorMessage('');
    dispatch(createBorrow({ book: bookId }));
  };

  if (bookLoading || isLoading) {
    return <Spinner />;
  }
  
  if (!book) {
    return (
      <div className="page-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Error
              </h3>
              <p className="text-red-500">{errorMessage || 'Book not found'}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => navigate('/books')}
              >
                Back to Books
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Borrow Book
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                You are about to borrow the following book.
              </p>
              {isSuccess && (
                <div className="mt-2 p-2 bg-green-50 text-green-800 rounded">
                  Book borrowed successfully! Redirecting to your borrows...
                </div>
              )}
              {errorMessage && (
                <div className="mt-2 p-2 bg-red-50 text-red-800 rounded">
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {book.title}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Author</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {book.author}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Genre</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {book.genre}
                    {book.subgenre && (
                      <span className="ml-2 text-gray-600 text-xs">
                        ({book.subgenre})
                      </span>
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {book.isbn}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Availability
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {book.availableCopies > 0 ? (
                      <span className="text-green-600">
                        {book.availableCopies} of {book.totalCopies} copies
                        available
                      </span>
                    ) : (
                      <span className="text-red-600">Not available</span>
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Due Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(
                      new Date().getTime() + 14 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                    <span className="text-sm text-gray-500 ml-2">
                      (14 days from today)
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => navigate('/books')}
              >
                Cancel
              </button>
              {book.availableCopies > 0 ? (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onBorrow}
                  disabled={isSuccess}
                >
                  Confirm Borrow
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                  disabled
                >
                  Not Available
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBorrow; 
import { useEffect } from 'react';
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

  const { book, isLoading: bookLoading } = useSelector((state) => state.books);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.borrows
  );

  // Fetch book details
  useEffect(() => {
    if (bookId) {
      dispatch(getBook(bookId));
    } else {
      navigate('/books');
    }
  }, [bookId, dispatch, navigate]);

  // Handle borrow response
  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate('/borrows');
    }
  }, [dispatch, isError, isSuccess, message, navigate]);

  const onBorrow = () => {
    dispatch(createBorrow({ book: bookId }));
  };

  if (bookLoading || isLoading || !book) {
    return <Spinner />;
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
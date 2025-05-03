import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBook, deleteBook, reset } from '../features/books/bookSlice';
import Spinner from '../components/Spinner';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { book, isLoading, isError, message } = useSelector(
    (state) => state.books
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(getBook(id));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, isError, message]);

  const onDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBook(id));
      navigate('/books');
    }
  };

  if (isLoading || !book) {
    return <Spinner />;
  }

  const isAdmin = user && (user.user.role === 'admin' || user.user.role === 'librarian');

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="flex justify-between px-4 py-5 sm:px-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {book.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  by {book.author}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/books"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back to Books
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      to={`/books/${id}/edit`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={onDeleteClick}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex border-t border-gray-200">
              <div className="w-1/3 border-r border-gray-200">
                <div className="h-96 overflow-hidden bg-gray-200">
                  <img
                    src={
                      book.coverImage === 'no-image.jpg'
                        ? 'https://via.placeholder.com/400x600?text=No+Image'
                        : book.coverImage
                    }
                    alt={book.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <div className="mt-2 flex justify-between">
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
                  <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-500">
                      Total: {book.totalCopies}
                    </p>
                    <p className="text-sm text-gray-500">
                      Published: {book.publicationYear}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">
                      Price: ${book.price ? book.price.toFixed(2) : '0.00'}
                    </p>
                  </div>

                  {user && (
                    <div className="mt-4 space-y-2">
                      {book.availableCopies > 0 && (
                        <Link
                          to={`/borrows/new?bookId=${book._id}`}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Borrow this Book
                        </Link>
                      )}
                      <button
                        onClick={() => window.alert(`You're about to buy "${book.title}" for $${book.price ? book.price.toFixed(2) : '0.00'}. This feature is coming soon!`)}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Buy this Book
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-2/3 p-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Description
                  </h3>
                  <div className="mt-4 text-gray-600">
                    <p>{book.description}</p>
                  </div>
                </div>

                <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail; 
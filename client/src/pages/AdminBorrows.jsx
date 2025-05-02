import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBorrows, returnBook, reset } from '../features/borrows/borrowSlice';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

function AdminBorrows() {
  const dispatch = useDispatch();

  const { borrows, isLoading, isError, message } = useSelector(
    (state) => state.borrows
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(getBorrows());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  // Function to check if a borrow is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Function to calculate days remaining or days overdue
  const getDaysInfo = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      return `${diffDays} days remaining`;
    } else {
      return `${Math.abs(diffDays)} days overdue`;
    }
  };

  const handleReturn = (id) => {
    if (window.confirm('Are you sure you want to mark this book as returned?')) {
      dispatch(returnBook(id));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
            Administration
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Manage Borrowings
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            View and manage all borrowed books
          </p>
        </div>

        {borrows.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No borrowed books
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no borrowed books in the system.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Book
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dates
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fine
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {borrows.map((borrow) => (
                        <tr key={borrow._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={
                                    borrow.book.coverImage === 'no-image.jpg'
                                      ? 'https://via.placeholder.com/40'
                                      : borrow.book.coverImage
                                  }
                                  alt={borrow.book.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  <Link
                                    to={`/books/${borrow.book._id}`}
                                    className="hover:text-primary-600"
                                  >
                                    {borrow.book.title}
                                  </Link>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {borrow.book.author}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ISBN: {borrow.book.isbn}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {borrow.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {borrow.user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">Borrowed:</span>{' '}
                              {new Date(
                                borrow.borrowDate
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">Due:</span>{' '}
                              {new Date(borrow.dueDate).toLocaleDateString()}
                            </div>
                            {borrow.returnDate && (
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">Returned:</span>{' '}
                                {new Date(
                                  borrow.returnDate
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {!borrow.returnDate && (
                              <div
                                className={`text-xs ${
                                  isOverdue(borrow.dueDate)
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                                }`}
                              >
                                {getDaysInfo(borrow.dueDate)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                borrow.status === 'returned'
                                  ? 'bg-green-100 text-green-800'
                                  : borrow.status === 'overdue'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {borrow.status.charAt(0).toUpperCase() +
                                borrow.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {borrow.fine > 0
                              ? `$${borrow.fine.toFixed(2)}`
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {borrow.status !== 'returned' && (
                              <button
                                onClick={() => handleReturn(borrow._id)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Return
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBorrows; 
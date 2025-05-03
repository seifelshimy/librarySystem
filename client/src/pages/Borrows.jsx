import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBorrows, reset } from '../features/borrows/borrowSlice';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

function Borrows() {
  const navigate = useNavigate();
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
            My Books
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Your Borrowed Books
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Manage your borrowings and keep track of due dates
          </p>
        </div>

        {!borrows || borrows.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No borrowed books
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't borrowed any books yet.
            </p>
            <div className="mt-6">
              <Link
                to="/books"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse Books
              </Link>
            </div>
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
                          Borrow Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Due Date
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {borrows.map((borrow) => (
                        <tr key={borrow._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {borrow.book && (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={
                                      !borrow.book.coverImage || borrow.book.coverImage === 'no-image.jpg'
                                        ? 'https://via.placeholder.com/40'
                                        : borrow.book.coverImage
                                    }
                                    alt={borrow.book ? borrow.book.title : 'Book Cover'}
                                  />
                                )}
                              </div>
                              <div className="ml-4">
                                {borrow.book ? (
                                  <>
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
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Book data unavailable
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                borrow.borrowDate
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(borrow.dueDate).toLocaleDateString()}
                            </div>
                            <div
                              className={`text-xs ${
                                isOverdue(borrow.dueDate) &&
                                borrow.status !== 'returned'
                                  ? 'text-red-500'
                                  : 'text-gray-500'
                              }`}
                            >
                              {borrow.status !== 'returned' &&
                                getDaysInfo(borrow.dueDate)}
                            </div>
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

export default Borrows; 
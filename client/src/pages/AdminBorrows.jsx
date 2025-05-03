import { useEffect, useState } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBorrows, returnBook, reset } from '../features/borrows/borrowSlice';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-red-600">
                Something went wrong!
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {this.state.error?.message || "Unknown error"}
              </p>
              <button 
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AdminBorrows() {
  console.log('AdminBorrows component rendering');
  
  const dispatch = useDispatch();
  const [returnInProgress, setReturnInProgress] = useState(false);

  const { borrows, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.borrows
  );

  const { user } = useSelector((state) => state.auth);

  console.log('AdminBorrows auth state:', { 
    isLoggedIn: !!user, 
    userRole: user?.user?.role,
    isAdmin: user?.user?.role === 'admin',
    isLibrarian: user?.user?.role === 'librarian',
    token: user?.token ? 'Token exists' : 'No token'
  });
  
  console.log('AdminBorrows borrows state:', { 
    borrows: Array.isArray(borrows) ? `${borrows.length} borrows` : 'not an array',
    isLoading, 
    isError, 
    isSuccess, 
    message 
  });

  useEffect(() => {
    console.log('AdminBorrows useEffect - Fetching borrows starting');
    if (isError) {
      console.error('Error fetching borrows:', message);
    }

    dispatch(getBorrows());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  // Handle success and error states for return book operation
  useEffect(() => {
    if (returnInProgress && !isLoading) {
      setReturnInProgress(false);
      
      if (isSuccess) {
        console.log('Book returned successfully');
      }
      
      if (isError) {
        console.error(message || 'Failed to return book');
      }
    }
  }, [isLoading, isSuccess, isError, message, returnInProgress]);

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
      setReturnInProgress(true);
      dispatch(returnBook(id));
    }
  };

  if (isLoading) {
    console.log('AdminBorrows is loading');
    return <Spinner />;
  }

  // Display a message if not authorized
  if (!user || (user.user.role !== 'admin' && user.user.role !== 'librarian')) {
    console.log('AdminBorrows - User not authorized');
    return (
      <div className="page-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-red-600">
              Access Denied
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log('AdminBorrows about to render data display', {
    hasBorrows: !!borrows,
    borrowsLength: borrows?.length,
    renderEmpty: !borrows || borrows.length === 0
  });

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

        {!borrows || borrows.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No borrowed books
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no borrowed books in the system.
            </p>
            
            {/* Debug section */}
            <div className="mt-8 p-4 border border-gray-300 rounded-md bg-gray-50 text-left mx-auto max-w-2xl overflow-auto">
              <h4 className="text-lg font-semibold mb-2">Debug Information</h4>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                {JSON.stringify({
                  auth: {
                    isLoggedIn: !!user,
                    userRole: user?.user?.role,
                    userId: user?.user?._id,
                  },
                  borrows: {
                    isArray: Array.isArray(borrows),
                    length: Array.isArray(borrows) ? borrows.length : null,
                  },
                  state: {
                    isLoading,
                    isError,
                    isSuccess,
                    message,
                  }
                }, null, 2)}
              </pre>
              <div className="mt-4">
                <button
                  onClick={() => dispatch(getBorrows())}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                  Retry Loading Borrows
                </button>
                
                {user && user.user && user.user.role === 'admin' && (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/borrows/test/create', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${user.token}`
                          }
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                          console.log('Test borrow created:', data);
                          alert('Test borrow created successfully. Refreshing data...');
                          dispatch(getBorrows());
                        } else {
                          console.error('Failed to create test borrow:', data);
                          alert(`Failed to create test borrow: ${data.message}`);
                        }
                      } catch (error) {
                        console.error('Error creating test borrow:', error);
                        alert(`Error: ${error.message}`);
                      }
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Create Test Borrow
                  </button>
                )}
              </div>
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
                      {borrows.map((borrow, index) => {
                        console.log(`Rendering borrow #${index}:`, borrow);
                        return borrow && (
                          <tr key={borrow._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {borrow.book ? (
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        borrow.book.coverImage === 'no-image.jpg'
                                          ? 'https://via.placeholder.com/40'
                                          : borrow.book.coverImage
                                      }
                                      alt={borrow.book.title || 'Book cover'}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      <Link
                                        to={`/books/${borrow.book._id}`}
                                        className="hover:text-primary-600"
                                      >
                                        {borrow.book.title || 'Unknown title'}
                                      </Link>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {borrow.book.author || 'Unknown author'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      ISBN: {borrow.book.isbn || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">
                                  Book data unavailable
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {borrow.user ? (
                                <>
                                  <div className="text-sm text-gray-900">
                                    {borrow.user.name || 'Unknown user'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {borrow.user.email || 'No email'}
                                  </div>
                                </>
                              ) : (
                                <div className="text-sm text-gray-500">
                                  User data unavailable
                                </div>
                              )}
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
                        );
                      })}
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

// Wrap the component with the error boundary
function AdminBorrowsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <AdminBorrows />
    </ErrorBoundary>
  );
}

export default AdminBorrowsWithErrorBoundary; 
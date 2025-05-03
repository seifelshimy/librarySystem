import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user && user.user && user.user.role === 'admin';
  const isLibrarian = user && user.user && user.user.role === 'librarian';
  
  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Administration Panel
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Manage books, borrowings and library resources
          </p>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {/* Management cards */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Book Management</h3>
                <p className="mt-3 text-base text-gray-500">
                  Add, edit, or remove books from the library catalog.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  to="/books/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Add New Book
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Borrow Management</h3>
                <p className="mt-3 text-base text-gray-500">
                  Track all borrowings, returns, and overdue books.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  to="/admin/borrows"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Manage Borrows
                </Link>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                  <p className="mt-3 text-base text-gray-500">
                    Manage users, roles, and permissions (admin only).
                  </p>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    Manage Users
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Role Information</h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Permission
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Librarian Access
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Admin Access
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    View Books
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Add/Edit Books
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Manage Borrows
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Manage Users
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">❌</td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    System Settings
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">❌</td>
                  <td className="px-3 py-4 text-sm text-gray-500">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 
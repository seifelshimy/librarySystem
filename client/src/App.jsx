import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import NewBook from './pages/NewBook';
import EditBook from './pages/EditBook';
import Borrows from './pages/Borrows';
import NewBorrow from './pages/NewBorrow';
import AdminBorrows from './pages/AdminBorrows';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pb-12 pt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              
              {/* Protected routes for authenticated users */}
              <Route element={<PrivateRoute />}>
                <Route path="/borrows" element={<Borrows />} />
                <Route path="/borrows/new" element={<NewBorrow />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Protected routes for admins and librarians */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/books/new" element={<NewBook />} />
                <Route path="/books/:id/edit" element={<EditBook />} />
                <Route path="/admin/borrows" element={<AdminBorrows />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
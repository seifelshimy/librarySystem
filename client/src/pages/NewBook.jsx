import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createBook } from '../features/books/bookSlice';
import Spinner from '../components/Spinner';

function NewBook() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.books);
  const [message, setMessage] = useState('');

  const initialValues = {
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    genre: '',
    subgenre: '',
    description: '',
    totalCopies: 1,
    price: 0,
    coverImage: ''
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    isbn: Yup.string().required('ISBN is required'),
    publicationYear: Yup.number()
      .required('Publication year is required')
      .integer('Must be a whole number')
      .min(1000, 'Must be a valid year')
      .max(new Date().getFullYear(), 'Cannot be in the future'),
    genre: Yup.string().required('Genre is required'),
    subgenre: Yup.string(),
    description: Yup.string().required('Description is required'),
    totalCopies: Yup.number()
      .required('Total copies is required')
      .integer('Must be a whole number')
      .min(1, 'Must be at least 1'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price cannot be negative'),
    coverImage: Yup.string().url('Must be a valid URL').nullable()
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(createBook(values)).unwrap();
      resetForm();
      setMessage('Book added successfully!');
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (error) {
      setMessage('Failed to add book: ' + error.message);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8">
          Add New Book
        </h1>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form className="space-y-6 bg-white py-6 px-4 sm:p-6 shadow sm:rounded-md">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Field
                      type="text"
                      name="title"
                      id="title"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Author
                    </label>
                    <Field
                      type="text"
                      name="author"
                      id="author"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="author"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="isbn"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ISBN
                    </label>
                    <Field
                      type="text"
                      name="isbn"
                      id="isbn"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="isbn"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="publicationYear"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Publication Year
                    </label>
                    <Field
                      type="number"
                      name="publicationYear"
                      id="publicationYear"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="publicationYear"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="genre"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Genre
                    </label>
                    <Field
                      type="text"
                      name="genre"
                      id="genre"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="genre"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="subgenre"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subgenre
                    </label>
                    <Field
                      type="text"
                      name="subgenre"
                      id="subgenre"
                      className="form-input"
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className="form-textarea"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="totalCopies"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Total Copies
                    </label>
                    <Field
                      type="number"
                      name="totalCopies"
                      id="totalCopies"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="totalCopies"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price ($)
                    </label>
                    <Field
                      type="number"
                      name="price"
                      id="price"
                      step="0.01"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="coverImage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cover Image URL
                    </label>
                    <Field
                      type="text"
                      name="coverImage"
                      id="coverImage"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="coverImage"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => navigate('/books')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add Book
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBook; 
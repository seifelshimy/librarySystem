import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBook, updateBook, reset } from '../features/books/bookSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Spinner from '../components/Spinner';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { book, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(getBook(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess && message === 'Book updated') {
      dispatch(reset());
      navigate(`/books/${id}`);
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, isSuccess, message, navigate, id]);

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
    description: Yup.string().required('Description is required'),
    totalCopies: Yup.number()
      .required('Total copies is required')
      .integer('Must be a whole number')
      .min(1, 'Must have at least one copy'),
  });

  const onSubmit = (values) => {
    dispatch(updateBook({ id, bookData: values }));
  };

  if (isLoading || !book) {
    return <Spinner />;
  }

  const initialValues = {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publicationYear: book.publicationYear,
    genre: book.genre,
    description: book.description,
    totalCopies: book.totalCopies,
    coverImage: book.coverImage === 'no-image.jpg' ? '' : book.coverImage,
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Edit Book
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Update the details of an existing book.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize
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

                  <div className="col-span-6">
                    <label
                      htmlFor="coverImage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cover Image URL (optional)
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
                      className="form-input"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {isError && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{message}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => navigate(`/books/${id}`)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save
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

export default EditBook; 
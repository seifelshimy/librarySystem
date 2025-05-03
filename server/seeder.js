const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/librarySystem');

// Sample books data
const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publicationYear: 1925,
    genre: 'Classic Fiction',
    description: 'A novel of American Dreams, love, and the Jazz Age. The story is of the young and mysterious millionaire Jay Gatsby and his passion for the beautiful Daisy Buchanan.',
    totalCopies: 10,
    availableCopies: 10,
    price: 12.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    publicationYear: 1960,
    genre: 'Classic Fiction',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. It became both an instant bestseller and a critical success when it was first published and has since been translated into more than forty languages.',
    totalCopies: 8,
    availableCopies: 8,
    price: 14.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg'
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    publicationYear: 1949,
    genre: 'Dystopian Fiction',
    description: 'The story takes place in an imagined future, the year 1984, when much of the world has fallen victim to perpetual war, omnipresent government surveillance, historical negationism and propaganda.',
    totalCopies: 12,
    availableCopies: 12,
    price: 11.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg'
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    isbn: '9780590353427',
    publicationYear: 1997,
    genre: 'Fantasy',
    description: 'The first novel in the Harry Potter series. The story follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.',
    totalCopies: 15,
    availableCopies: 15,
    price: 15.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    publicationYear: 1937,
    genre: 'Fantasy',
    description: 'Written for J.R.R. Tolkien\'s own children, The Hobbit met with instant critical acclaim when it was first published in 1937. The adventure follows the journey of Bilbo Baggins, who had no desire to leave his comfortable hobbit hole.',
    totalCopies: 10,
    availableCopies: 10,
    price: 13.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/710+HcoP38L.jpg'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    publicationYear: 1813,
    genre: 'Classic Fiction',
    description: 'Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments.',
    totalCopies: 7,
    availableCopies: 7,
    price: 10.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    publicationYear: 1951,
    genre: 'Coming-of-Age Fiction',
    description: 'The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the "phoniness" of the adult world.',
    totalCopies: 9,
    availableCopies: 9,
    price: 12.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '9780060850524',
    publicationYear: 1932,
    genre: 'Dystopian Fiction',
    description: 'Largely set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation and classical conditioning.',
    totalCopies: 11,
    availableCopies: 11,
    price: 11.99,
    coverImage: 'https://diwanegypt.com/wp-content/uploads/2020/08/9780099477464.jpg'
  }
];

// Import data into DB
const importData = async () => {
  try {
    await Book.deleteMany();
    console.log('Books cleared from database...');

    await Book.insertMany(books);
    console.log('Sample books data imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run the import function
importData();
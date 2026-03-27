import React, { createContext, useContext, useState } from 'react';

const mockBooks = [
  {
    id: '1',
    title: 'THE IDIOT',
    author: 'Fyodor Dostoevsky',
    year: '1869',
    rating: 4,
    coverImg: 'https://books.google.co.in/books/content?id=5fyuj9x9UZIC&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U0iwrhTENPXQNuf6ozlf0O7X0Vn3A&w=1280',
    tags: ['Classics', 'Fiction', 'Philosophy'],
    description: "A gothic masterpiece of tempestuous passions and dark secrets, following the Christ-like Prince Myshkin as he navigates the corruption of 19th-century Russian society.",
    reviews: [
      { title: 'Killer drama', text: "I’ve been trying to review this book for over a week now. It's a profound exploration of human soul and tragedy." },
      { title: 'The Soul of Russia', text: "Dostoevsky's insight into the psychology of his characters is unparalleled. This book leaves a mark." },
      { title: 'Brilliant!', text: "A challenging but rewarding read. Prince Myshkin is one of literature's most memorable characters." }
    ]
  },
  {
    id: '2',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    year: '1847',
    rating: 5,
    coverImg: '',
    tags: ['Romance', 'Classic', 'Gothic'],
    description: "Orphaned as a child, Jane Eyre must overcome poverty and injustice to find fulfillment in this timeless tale of love and independence.",
    reviews: [
      { title: 'Romantic Intensity', text: "The chemistry between Jane and Rochester is unmatched. Brontë's prose is hauntingly beautiful." },
      { title: 'Female Strength', text: "Jane is such a powerful, independent character for her time. Inspiring." }
    ]
  },
  {
    id: '3',
    title: 'THE GREAT GATSBY',
    author: 'F. Scott Fitzgerald',
    year: '1925',
    rating: 4,
    coverImg: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=300&h=450',
    tags: ['Classics', 'American', 'Tragedy'],
    description: "A portrait of the Jazz Age in all its decadence and excess, Gatsby's quest for the elusive Daisy Buchanan remains a powerful critique of the American Dream.",
    reviews: [
      { title: 'Sparkling Prose', text: "Fitzgerald captures the mood of an era so perfectly. It's both beautiful and devastating." }
    ]
  },
  {
    id: '4',
    title: 'PRIDE & PREJUDICE',
    author: 'Jane Austen',
    year: '1813',
    rating: 5,
    coverImg: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450',
    tags: ['Classics', 'Romance', 'Satire'],
    description: "The classic tale of Elizabeth Bennet and Mr. Darcy as they navigate the social complexities of 19th-century England.",
    reviews: [
      { title: 'Witty and Wise', text: "Austen's social commentary is as sharp today as it was 200 years ago. Pure delight." }
    ]
  }
];

const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState(mockBooks);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
}

export const useBooks = () => useContext(BookContext);

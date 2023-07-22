export class Libro {
    constructor(book_id, title, publisher, isbn, course_level, subject, is_school_book, author, fav){
        this.book_id = book_id;
        this.title = title;
        this.publisher = publisher;
        this.isbn = isbn;
        this.course_level = course_level;
        this.subject = subject;
        this.is_school_book = is_school_book;
        this.author = author;
        this.fav = fav;
    }
}
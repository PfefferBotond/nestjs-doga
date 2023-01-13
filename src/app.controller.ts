import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import Book from './book.tdo';
import db from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index(@Query('rating') rating: number) {
    const [rows]: any = await db.execute('SELECT * FROM books')

    let books = rows as Book[];

    if(rating != null) {
      books = books.filter(book => book.rating == rating)
    }

    books.sort((a,b) => b.rating-a.rating)

    return {
      books: books
    }

  }

  @Get('/books/new')
  @Render('newBook')
  newBookForm() {
    return {

    }
  }

  @Post('/books/new')
  @Redirect()
  async addNewBook(@Body() book: Book) {
    console.log(book)
    await db.execute('INSERT INTO books (title, rating) VALUES (?, ?)', [book.title, book.rating]);
    return {
      url: '/'
    }
  }
}

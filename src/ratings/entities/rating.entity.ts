import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity({ name: 'ratings' })
@Unique(['user', 'book'])
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  score: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, { eager: false, onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

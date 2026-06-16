import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 180 })
  title: string;

  @Column({ length: 180 })
  authors: string;

  @Column({ length: 120 })
  editorial: string;

  @Column({ length: 100 })
  genre: string;

  @Column({ type: 'text' })
  synopsis: string;

@Column({
  type: 'varchar',
  length: 500,
  nullable: true,
})
imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

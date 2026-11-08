import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity('exam_results')
export class ExamResult {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  sbd!: string;

  @Column()
  toan!: number | null;

  @Column()
  ngu_van!: number | null;

  @Column()
  ngoai_ngu!: number | null;

  @Column()
  vat_li!: number | null;

  @Column()
  hoa_hoc!: number | null;

  @Column()
  sinh_hoc!: number | null;

  @Column()
  lich_su!: number | null;

  @Column()
  dia_li!: number | null;

  @Column()
  gdcd!: number | null;

  @Column()
  ma_ngoai_ngu!: string | null;
}
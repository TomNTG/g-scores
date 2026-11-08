export class Subject {
  constructor(
    public readonly key: string,
    public readonly name: string,
  ) {}

  getFieldPath(): string {
    return `$${this.key}`;
  }
}

export class SubjectsCatalog {
  private readonly subjects: Subject[] = [
    new Subject('toan', 'Toán'),
    new Subject('ngu_van', 'Ngữ văn'),
    new Subject('ngoai_ngu', 'Ngoại ngữ'),
    new Subject('vat_li', 'Vật lý'),
    new Subject('hoa_hoc', 'Hóa học'),
    new Subject('sinh_hoc', 'Sinh học'),
    new Subject('lich_su', 'Lịch sử'),
    new Subject('dia_li', 'Địa lý'),
    new Subject('gdcd', 'GDCD'),
  ];

  getAll(): readonly Subject[] {
    return this.subjects;
  }
}
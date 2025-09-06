import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class LocalizedNgbDateParserFormatter extends NgbDateParserFormatter {
  private readonly locale: string = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en-US';
  private readonly order: Array<'day' | 'month' | 'year'> = this.computeOrder();

  private computeOrder(): Array<'day' | 'month' | 'year'> {
    const parts = new Intl.DateTimeFormat(this.locale).formatToParts(new Date(2000, 11, 31));
    return parts
      .filter(p => p.type === 'day' || p.type === 'month' || p.type === 'year')
      .map(p => p.type as 'day' | 'month' | 'year');
  }

  parse(value: string | null | undefined): NgbDateStruct | null {
    if (!value) return null;
    const digits = value.match(/\d+/g);
    if (!digits || digits.length < 3) return null;

    const map: Record<'day' | 'month' | 'year', number> = { day: 1, month: 1, year: 0 } as any;
    for (let i = 0; i < 3; i++) {
      const token = this.order[i];
      const n = parseInt(digits[i], 10);
      if (Number.isFinite(n)) map[token] = n;
    }

    const { day, month, year } = map;
    if (!year || !month || !day) return null;
    return { year, month, day };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const d = new Date(date.year, (date.month ?? 1) - 1, date.day ?? 1);
    return new Intl.DateTimeFormat(this.locale).format(d);
  }
}


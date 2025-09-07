import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const DDMMYYYY = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

@Injectable()
export class DdmmyyyyNgbDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string | null | undefined): NgbDateStruct | null {
    if (!value) return null;
    const m = value.match(DDMMYYYY);
    if (!m) return null;

    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);

    // Validate real calendar date (no rollover)
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return { day, month, year };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const d = String(date.day).padStart(2, '0');
    const m = String(date.month).padStart(2, '0');
    const y = String(date.year).padStart(4, '0');
    return `${d}/${m}/${y}`;
  }
}

export const DDMYYYY_REGEX = DDMMYYYY;


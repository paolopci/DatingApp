import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// Regex per formato rigoroso dd/MM/yyyy con zeri iniziali:
// - Giorno: 01–31
// - Mese: 01–12
// - Anno: 4 cifre
const DDMMYYYY = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

@Injectable()
export class DdmmyyyyNgbDateParserFormatter extends NgbDateParserFormatter {
  // Converte la stringa dell'input in NgbDateStruct.
  // Ritorna null se il formato non è dd/MM/yyyy oppure se la data non esiste (es. 31/02).
  parse(value: string | null | undefined): NgbDateStruct | null {
    if (!value) return null;
    const m = value.match(DDMMYYYY);
    if (!m) return null; // formato non valido

    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);

    // Verifica calendario reale (evita rollover JavaScript dei mesi/giorni)
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return { day, month, year };
  }

  // Converte l'NgbDateStruct in stringa sempre nel formato dd/MM/yyyy (con zeri)
  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const d = String(date.day).padStart(2, '0');
    const m = String(date.month).padStart(2, '0');
    const y = String(date.year).padStart(4, '0');
    return `${d}/${m}/${y}`;
  }
}

// Esportiamo la stessa regex per la validazione lato componente (input manuale)
export const DDMYYYY_REGEX = DDMMYYYY;

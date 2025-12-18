import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private themeSubject = new BehaviorSubject<ThemeMode>(
    (localStorage.getItem('theme') as ThemeMode) || 'light'
  );

  theme$ = this.themeSubject.asObservable();

  toggleTheme() {
    const next =
      this.themeSubject.value === 'light' ? 'dark' : 'light';

    this.themeSubject.next(next);
    localStorage.setItem('theme', next);
  }

  currentTheme() {
    return this.themeSubject.value;
  }

  themeChanges() {
    return this.themeSubject.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private dateSubject = new Subject<number>();

    public setDate(year: number) {
        this.dateSubject.next(year);
    }

    public getDate() {
        return this.dateSubject.asObservable();
    }
}
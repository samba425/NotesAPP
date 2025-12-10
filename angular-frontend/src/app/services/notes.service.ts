import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Note {
  id?: number;
  userId?: number;
  title: string;
  content: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl).pipe(
      tap(notes => {
        if (environment.enableLogging) {
          console.log(`Fetched ${notes.length} notes from ${environment.backendType} backend`);
        }
      })
    );
  }

  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`).pipe(
      tap(note => {
        if (environment.enableLogging) {
          console.log('Fetched note:', note);
        }
      })
    );
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note).pipe(
      tap(createdNote => {
        if (environment.enableLogging) {
          console.log('Created note:', createdNote);
        }
      })
    );
  }

  updateNote(id: number, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note).pipe(
      tap(updatedNote => {
        if (environment.enableLogging) {
          console.log('Updated note:', updatedNote);
        }
      })
    );
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (environment.enableLogging) {
          console.log('Deleted note:', id);
        }
      })
    );
  }
}

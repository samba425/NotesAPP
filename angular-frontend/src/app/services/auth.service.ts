import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(environment.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      tap(() => {
        if (environment.enableLogging) {
          console.log('User registered successfully');
        }
      })
    );
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(response => {
        localStorage.setItem(environment.tokenKey, response.token);
        localStorage.setItem(environment.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        
        if (environment.enableLogging) {
          console.log('User logged in:', response.user);
          console.log('Using backend:', environment.backendType);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    
    if (environment.enableLogging) {
      console.log('User logged out');
    }
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }
}

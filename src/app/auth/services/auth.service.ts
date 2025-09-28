import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { SessionStorageService } from './session-storage.service';

const API_URL = 'http://localhost:4000/api';

interface LoginResponse {
    successful: boolean;
    result: string;
    user: {
        email: string;
        name: string | null;
        role: string;
    };
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthorized$$ = new BehaviorSubject<boolean>(false);
    private isAdmin$$ = new BehaviorSubject<boolean>(false);

    public isAuthorized$ = this.isAuthorized$$.asObservable();
    public isAdmin$ = this.isAdmin$$.asObservable();

    constructor(
        private http: HttpClient,
        private sessionStorage: SessionStorageService
    ) {
        this.isAuthorized$$.next(!!this.sessionStorage.getToken());
    }

    login(user: { email: string; password: string }): Observable<void> {
        return this.http.post<LoginResponse>(`${API_URL}/login`, user).pipe(
            tap(res => {
                if (res.successful && res.result) {
                    this.sessionStorage.setToken(res.result);
                    this.isAuthorized$$.next(true);
                    this.isAdmin$$.next(res.user.role === 'admin');
                }
            }),
            map(() => void 0)
        );
    }

    logout(): Observable<void> {
        return this.http.delete(`${API_URL}/logout`).pipe(
            tap(() => {
                this.sessionStorage.deleteToken();
                this.isAuthorized$$.next(false);
                this.isAdmin$$.next(false);
            }),
            map(() => void 0)
        );
    }

    register(user: RegisterRequest): Observable<any> {
        return this.http.post(`${API_URL}/register`, user);
    }

    get isAuthorized(): boolean {
        return this.isAuthorized$$.getValue();
    }
}

import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../window.provider';

const TOKEN = 'SESSION_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(@Inject(WINDOW) private window: Window) {}

  setToken(token: string): void {
    this.window.sessionStorage.setItem(TOKEN, token);
  }

  getToken(): string | null {
    return this.window.sessionStorage.getItem(TOKEN);
  }

  deleteToken(): void {
    this.window.sessionStorage.removeItem(TOKEN);
  }
}

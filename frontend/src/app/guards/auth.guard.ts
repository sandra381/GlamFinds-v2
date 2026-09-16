import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userId = localStorage.getItem('ids');
    const user = localStorage.getItem('user');

    // Si hay sesión válida, permitir acceso
    if (userId && user) {
      return true;
    }

    // Si no hay sesión, redirigir al login
    console.warn('⛔ Acceso denegado: no hay sesión activa. Redirigiendo al login...');
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

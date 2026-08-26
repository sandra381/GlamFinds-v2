import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return 'assets/img/default.jpg'; // Imagen por defecto
    }

    // Si ya es una URL completa (http o https), devolverla tal cual
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // Si es ruta local (ej. 'foto.jpg'), prefijar con assets/img/
    return `assets/img/${value}`;
  }
}

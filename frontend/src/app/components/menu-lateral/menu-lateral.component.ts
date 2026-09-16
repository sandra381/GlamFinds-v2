import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  user: any = {};
  usuariolog = Number(localStorage.getItem('ids'));

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    if (this.usuariolog) {
      this.backend.obtenerUsuario(this.usuariolog).subscribe({
        next: (res: any) => {
          if (res.datos && res.datos.length > 0) {
            this.user = res.datos[0];
          }
        },
        error: (err: any) => console.error('Error cargando usuario en sidebar:', err)
      });
    }
  }
}

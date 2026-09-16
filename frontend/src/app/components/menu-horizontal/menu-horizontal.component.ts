import { Component, ViewChild } from '@angular/core';
import { FeedComponent } from '../feed/feed.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';
import { PostCreateComponent } from '../post-create/post-create.component';

@Component({
  selector: 'app-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss']
})
export class MenuHorizontalComponent {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('feed') info!: FeedComponent;
  url: any;
  msg = '';
  imgUrl= "";
  constructor(public dialog: MatDialog,private router:Router,private backend1: BackendService){}
  user: any={
    id_user:0,
    usuario:'',
    nombre:'',
    apellido:'',
    edad:'',
    sexo:'',
    correo:'',
    contrase:'',
    imagen:''
  }
  ngAfterViewInit(){
    var id_new = localStorage.getItem('ids');
    if(id_new){
      this.backend1.obtenerUsuario( parseInt(id_new)).subscribe(x=>{
      console.log(x.datos[0]);
      this.user = x.datos[0];
      const read = new FileReader();
      read.onload = (this.user);
    })}
  }
  openAgregar() {
    this.dialog.open(PostCreateComponent, { restoreFocus: false, id: 'agregar' });
  }

  cerrarSesion() {
    localStorage.removeItem('ids');
    localStorage.removeItem('user');
    localStorage.clear();

    this.router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  url: any;
	msg = '';
  formGroups: FormGroup = new FormGroup({});
  imgUrl: string | null = null;
  fileType: string | null = null;

  constructor(private fb: FormBuilder,private router:Router, private backend:BackendService,public snackBar: MatSnackBar,public dialog: MatDialog) {
    const user = localStorage.getItem('ids');
    this.formGroups = this.fb.group({
      id:"",
      descripcion: "",
      imagen:"",
      autor: Number(user),
      categoria: "",
    });
    console.log(user);
  }
  //Post Generales
  guardarPostG() {
    const formData = new FormData();
    if (this.msg) {
      formData.append('imagen', this.msg);
    }

    // Crear el filtro de palabras inapropiadas

    const descripcion = this.formGroups.controls['descripcion'].value;
    const imagen = this.formGroups.controls['imagen'].value;
    const categoria = this.formGroups.controls['categoria'].value;

    if (!descripcion || !imagen || !categoria) {
      this.snackBar.open('Por favor, complete todos los campos correctamente.', 'Cerrar', {
        duration: 4000,
        panelClass: ['mensaje-error']
      });
      return;
    }

    this.backend.insertarPosts(formData, this.formGroups.value).subscribe(
      (response) => {
        this.snackBar.open('¡Post publicado con éxito! 🚀💫🌈 ¡Sigue brillando! ✨✨', 'Cerrar', {
          duration: 4000,
          panelClass: ['mensaje-exito']
        });
        this.limpiar();
        location.reload();
      },
      (error) => {
        this.snackBar.open('¡Oops! No se pudo publicar el post. 😞🚫', 'Cerrar', {
          duration: 4000,
          panelClass: ['mensaje-error']
        });
        console.error('Error al publicar:', error);
      }
    );
  }
  imagenSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileType = file.type;

      this.msg = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imgUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  limpiar(){
    this.formGroups.reset();
  }
  cerrarModalSegunRuta() {
    const rutaActual = this.router.url;
    if (rutaActual === '/home') {
      this.cerrarModal();
    } else if (rutaActual === '/ropa') {
      this.cerrarModal();
    }else if (rutaActual === '/maquillaje') {
      this.cerrarModal();
    }else if (rutaActual === '/accesorios') {
      this.cerrarModal();
    }else if (rutaActual === '/zapatos') {
      this.cerrarModal();
    }
  }

  cerrarModal() {
    const dialogRef = this.dialog.getDialogById('agregar');
    if (dialogRef) {
      dialogRef.close();
    }
    console.log('Cerrando el modal');
  }
  isImage(fileUrl: string | null): boolean {
    return this.fileType?.startsWith('image') ?? false;
  }
}

import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-articulo-create',
  templateUrl: './articulo-create.component.html',
  styleUrls: ['./articulo-create.component.scss']
})
export class ArticuloCreateComponent {
  url: any;
	msg = '';
  imgUrl= "";
  fileType: string | null = null;
  formGroups: FormGroup = new FormGroup({});
  @ViewChild('content') editorComponent: ElementRef;


  constructor(private fb: FormBuilder,private router:Router, private backend:BackendService,public snackBar: MatSnackBar,public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    const user = localStorage.getItem('ids');
    this.formGroups = this.fb.group({
      id:"",
      titulo: "",
      contenido: "",
      imagen:"",
      autor: Number(user),
      categoria: "",
    });
    if (data) {
      this.formGroups.patchValue({
        id: data.id_post,
        titulo: data.titulo,
        contenido: data.contenido,
        imagen: data.imagen,
        categoria: data.id_categoria?.toString(),
      });
      this.article = data.contenido || '';
      if (data.imagen) {
        this.imgUrl = data.imagen.startsWith('http') ? data.imagen : '../../../assets/img/' + data.imagen;
        this.fileType = 'image/';
      }
    }
    console.log(user);
  }

  article = "";
  modelChangeFn(e: string) {
    this.article = e;
    console.info(this.article);
  }

  guardarPostA() {
    const formData = new FormData();
    if (this.msg) {
        formData.append('imagen', this.msg);
    }

    const titulo = this.formGroups.controls['titulo'].value;
    const contenido = this.formGroups.controls['contenido'].value;
    const categoria = this.formGroups.controls['categoria'].value;

    if (!titulo || !contenido || !categoria) {
        this.snackBar.open('Por favor, complete todos los campos correctamente.', 'Cerrar', {
            duration: 4000,
            panelClass: ['mensaje-error']
        });
        return;
    }

    const userId = localStorage.getItem('ids');
    // Agregar campos de texto al FormData
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('categoria', categoria);
    formData.append('autor', userId ? userId : '0');

    // Enviar directamente formData sin pasar por formGroups.value
    this.backend.insertarArticulos(formData).subscribe(
        (response) => {
            this.snackBar.open('¡Post publicado con éxito! 🚀💫🌈 ¡Sigue brillando! ✨✨', 'Cerrar', {
                duration: 4000,
                panelClass: ['mensaje-exito']
            });
            this.limpiar();
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
  isImage(fileUrl: string | null): boolean {
    return this.fileType?.startsWith('image') ?? false;
  }

}

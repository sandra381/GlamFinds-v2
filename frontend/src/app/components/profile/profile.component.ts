import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// =============================================
// INTERFACES PARA TIPADO
// =============================================
interface Prenda {
  label: string;
  label_id: number;
  confidence: number;
  bbox: number[];
  colors: {
    vibrant: number[];
    muted: number[];
    third: number[];
  };
  mask_b64?: string;
}

interface MakeupZone {
  id: number;
  zone: string;
  has_makeup: boolean;
  distance_to_skin: number;
  color_name: string | null;
  product_link: string | null;
  colors: {
    vibrant: number[];
    muted: number[];
    third: number[];
  };
  bbox?: number[];
}

interface Post {
  id_post: number;
  descripcion: string;
  imagen: string;
  id_user: number;
  usuario: string;
  id_categoria?: number;
  name_categoria?: string;
  image_width?: number;
  image_height?: number;
  face_detected?: boolean;
  skin_reference_color?: number[] | null;
  prendas?: Prenda[];
  makeup_zones?: MakeupZone[];
  _naturalWidth?: number;
  _naturalHeight?: number;
  _displayWidth?: number;
  _displayHeight?: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Datos del usuario
  posts_generales: any = {};
  imgUrl: string = '';

  // Posts propios, guardados y artículos
  dataSource: Post[] = [];
  dataSource4: Post[] = []; // Guardados (posts)
  dataSource5: any[] = []; // Artículos propios
  dataSource6: any[] = []; // Outfits guardados

  // Estadísticas
  postsCount: number = 0;
  followersCount: number = 0;
  followingCount: number = 0;

  // Estado de interacciones
  comentario: { [key: number]: string } = {};
  comentarios: { [key: number]: any[] } = {};
  likes: { [key: number]: any } = {};
  toggle: { [key: number]: boolean } = {};
  toggle1: { [key: number]: boolean } = {};
  perfil: { [key: number]: any } = {};

  // Control de tabs
  activeTab: string = 'publicaciones';

  // Usuario logueado
  usuariolog: number = Number(localStorage.getItem('ids')) || 0;
  esMiPerfil: boolean = true;

  // Archivo seleccionado para editar perfil
  archivoSeleccionado: File | null = null;

  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Determinar qué usuario estamos viendo
    const idRuta = this.route.snapshot.paramMap.get('id');
    const idUsuario = idRuta ? Number(idRuta) : this.usuariolog;

    this.esMiPerfil = (idUsuario === this.usuariolog);

    // Cargar datos del usuario
    this.cargarPerfil(idUsuario);
    this.cargarPosts(idUsuario);
    this.cargarEstadisticas(idUsuario);

    // Si es mi perfil, cargar también guardados, artículos y outfits
    if (this.esMiPerfil) {
      this.cargarGuardados(idUsuario);
      this.cargarArticulos(idUsuario);
      this.cargarOutfits(idUsuario);
    }
  }

  // =============================================
  // CARGAR PERFIL
  // =============================================
  cargarPerfil(id: number) {
    this.backend.obtenerUsuario(id).subscribe({
      next: (res: any) => {
        if (res.datos && res.datos.length > 0) {
          this.posts_generales = res.datos[0];
        }
      },
      error: (err: any) => console.error('Error cargando perfil:', err)
    });
  }

  // =============================================
  // CARGAR POSTS DEL USUARIO
  // =============================================
  cargarPosts(id: number) {
    this.backend.PostPerfil(id).subscribe({
      next: async (res: any) => {
        this.dataSource = res.datos || [];
        this.postsCount = this.dataSource.length;

        // Inicializar estados
        this.dataSource.forEach(post => {
          this.comentario[post.id_post] = '';
          this.toggle[post.id_post] = false;
          this.toggle1[post.id_post] = false;
        });

        // Cargar comentarios, likes y perfiles
        for (const post of this.dataSource) {
          await this.cargarComentarios(post.id_post);
          await this.cargarLikes(post.id_post);
          if (post.id_user) {
            await this.cargarPerfilAutor(post.id_user);
          }
        }
      },
      error: (err: any) => console.error('Error cargando posts:', err)
    });
  }

  // =============================================
  // CARGAR ESTADÍSTICAS
  // =============================================
  cargarEstadisticas(id: number) {
    this.backend.getUserStats(id).subscribe({
      next: (res: any) => {
        this.followersCount = res.followers || 0;
        this.followingCount = res.following || 0;
      },
      error: (err: any) => console.error('Error cargando stats:', err)
    });
  }

  // =============================================
  // CARGAR GUARDADOS
  // =============================================
  cargarGuardados(id: number) {
    this.backend.getSave(id).subscribe({
      next: (res: any) => {
        this.dataSource4 = res.datos || [];
        this.dataSource4.forEach(post => {
          this.toggle[post.id_post] = false;
        });
      },
      error: (err: any) => console.error('Error cargando guardados:', err)
    });
  }

  // =============================================
  // CARGAR ARTÍCULOS
  // =============================================
  cargarArticulos(id: number) {
    this.backend.obtenerArticulos().subscribe({
      next: (res: any) => {
        const todos = res.datos || [];
        this.dataSource5 = todos.filter((a: any) => a.id_user === id);
      },
      error: (err: any) => console.error('Error cargando artículos:', err)
    });
  }

  // =============================================
  // CARGAR OUTFITS GUARDADOS
  // =============================================
  cargarOutfits(id: number) {
    this.backend.obtenerOutfitsGuardados(id).subscribe({
      next: (res: any) => {
        this.dataSource6 = (res.datos || []).map((o: any) => ({
          ...o,
          outfit: typeof o.json_generado === 'string' ? JSON.parse(o.json_generado) : o.json_generado
        }));
      },
      error: (err: any) => console.error('Error cargando outfits:', err)
    });
  }

  // =============================================
  // HELPERS
  // =============================================
  async cargarComentarios(idPost: number) {
    return new Promise<void>((resolve) => {
      this.backend.obtenerComentarioUser(idPost, this.usuariolog, 0).subscribe({
        next: (res: any) => {
          this.comentarios[idPost] = res.datos || [];
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  async cargarLikes(idPost: number) {
    return new Promise<void>((resolve) => {
      this.backend.countLike(idPost).subscribe({
        next: (res: any) => {
          this.likes[idPost] = res.datos?.[0] || { cantidad: 0 };
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  async cargarPerfilAutor(idUser: number) {
    return new Promise<void>((resolve) => {
      this.backend.obtenerUsuario(idUser).subscribe({
        next: (res: any) => {
          if (res.datos && res.datos.length > 0) {
            this.perfil[idUser] = res.datos[0];
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  isImage(filename: string): boolean {
    if (!filename) return false;
    const ext = filename.toLowerCase().split('.').pop() || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }

  // =============================================
  // INTERACCIONES
  // =============================================
  like(idPost: number, index: number) {
    const userId = this.usuariolog;
    if (this.toggle[idPost]) {
      // Quitar like
      this.backend.eliminarLike(idPost, userId).subscribe({
        next: () => {
          this.toggle[idPost] = false;
          if (this.likes[idPost]) this.likes[idPost].cantidad = Math.max(0, (this.likes[idPost].cantidad || 0) - 1);
        },
        error: (err: any) => console.error('Error quitando like:', err)
      });
    } else {
      // Dar like
      this.backend.guardarLikes({ post: idPost, navegante: userId }).subscribe({
        next: () => {
          this.toggle[idPost] = true;
          if (!this.likes[idPost]) this.likes[idPost] = { cantidad: 0 };
          this.likes[idPost].cantidad = (this.likes[idPost].cantidad || 0) + 1;
          // Actualizar preferencias para el feed "Para ti"
          this.backend.actualizarPreferencias(idPost).subscribe({ error: () => {} });
        },
        error: (err: any) => console.error('Error dando like:', err)
      });
    }
  }

  comment(idPost: number) {
    const texto = (this.comentario[idPost] || '').trim();
    if (!texto) return;

    const navegante = this.usuariolog;
    this.backend.guardarComentarios({ post: idPost, navegante, comments: texto }).subscribe({
      next: () => {
        this.comentario[idPost] = '';
        this.cargarComentarios(idPost);
      },
      error: (err: any) => console.error('Error al comentar:', err)
    });
  }

  deleteComment(idPost: number, idComment: number) {
    this.backend.eliminarComentario(idPost, this.usuariolog, idComment).subscribe({
      next: () => this.cargarComentarios(idPost),
      error: (err: any) => console.error('Error al eliminar comentario:', err)
    });
  }

  unsaveGuardado(idPost: number) {
    this.backend.eliminarSave(idPost, this.usuariolog).subscribe({
      next: () => {
        this.dataSource4 = this.dataSource4.filter(p => p.id_post !== idPost);
        this.snackBar.open('Eliminado de guardados', 'Cerrar', { duration: 2000 });
      },
      error: (err: any) => console.error('Error:', err)
    });
  }

  unsaveArticulo(idPost: number) {
    this.backend.eliminarSaveA(idPost, this.usuariolog).subscribe({
      next: () => {
        this.dataSource5 = this.dataSource5.filter(a => a.id_post !== idPost);
      },
      error: (err: any) => console.error('Error:', err)
    });
  }

  unsaveOutfit(idOutfit: number) {
    this.backend.eliminarOutfitGuardado(idOutfit).subscribe({
      next: () => {
        this.dataSource6 = this.dataSource6.filter(o => o.id_outfit !== idOutfit);
      },
      error: (err: any) => console.error('Error:', err)
    });
  }

  // =============================================
  // EDITAR PERFIL
  // =============================================
  imagenSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      // Guardar archivo para subir
      this.archivoSeleccionado = file;
    }
  }

  guardarModificar() {
    const formData = new FormData();
    formData.append('usuario', this.posts_generales.usuario || '');
    formData.append('descripcion', this.posts_generales.descripcion || '');

    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    } else if (this.posts_generales.imagen) {
      formData.append('imagen', this.posts_generales.imagen);
    }

    this.backend.editarPosts2(this.usuariolog, formData).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
        this.cargarPerfil(this.usuariolog);
      },
      error: (err: any) => {
        console.error('Error actualizando perfil:', err);
        this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // =============================================
  // HOTSPOTS (prendas y maquillaje)
  // =============================================
  onImageLoad(event: any, articulo: Post) {
    const img = event.target as HTMLImageElement;
    articulo._naturalWidth = img.naturalWidth;
    articulo._naturalHeight = img.naturalHeight;
    articulo._displayWidth = img.clientWidth;
    articulo._displayHeight = img.clientHeight;
  }

  getTopPosition(bbox: number[], articulo: Post): string {
    if (!bbox || bbox.length !== 4 || !articulo._naturalHeight) return '0px';
    const y1 = bbox[1];
    const naturalH = articulo._naturalHeight;
    const top = (y1 / naturalH) * 100;
    return `${top}%`;
  }

  getLeftPosition(bbox: number[], articulo: Post): string {
    if (!bbox || bbox.length !== 4 || !articulo._naturalWidth) return '0px';
    const x1 = bbox[0];
    const naturalW = articulo._naturalWidth;
    const left = (x1 / naturalW) * 100;
    return `${left}%`;
  }

  getMakeupTopPosition(zone: MakeupZone, articulo: Post): string {
    if (!zone.bbox || !articulo._naturalHeight) return '50%';
    const y1 = zone.bbox[1];
    const top = (y1 / articulo._naturalHeight) * 100;
    return `${top}%`;
  }

  getMakeupLeftPosition(zone: MakeupZone, articulo: Post): string {
    if (!zone.bbox || !articulo._naturalWidth) return '50%';
    const x1 = zone.bbox[0];
    const left = (x1 / articulo._naturalWidth) * 100;
    return `${left}%`;
  }

  getButtonClass(label: string): string {
    if (!label) return '';
    const l = label.toLowerCase();
    if (l.includes('shirt') || l.includes('top') || l.includes('sweater')) return 'btn-top';
    if (l.includes('pant') || l.includes('short') || l.includes('skirt')) return 'btn-bottom';
    if (l.includes('shoe') || l.includes('sneaker') || l.includes('boot')) return 'btn-shoes';
    if (l.includes('bag') || l.includes('hat') || l.includes('watch') || l.includes('glass')) return 'btn-accessory';
    return '';
  }

  getSearchUrl(prenda: Prenda, articulo: Post): string {
    const label = (prenda.label || '').split(',')[0].trim();
    const query = encodeURIComponent(label);
    return `https://www.google.com/search?tbm=shop&q=${query}`;
  }

  getMakeupSearchUrl(zone: MakeupZone, articulo: Post): string {
    const color = zone.color_name || '';
    const zoneName = zone.zone || '';
    const query = encodeURIComponent(`${zoneName} makeup ${color}`);
    return `https://www.google.com/search?tbm=shop&q=${query}`;
  }
}

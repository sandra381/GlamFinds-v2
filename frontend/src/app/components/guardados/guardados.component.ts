import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comments } from 'src/app/models/Comments';
import { Comments2 } from 'src/app/models/Comments2';
import { Likes } from 'src/app/models/Likes';
import { Likes_cant } from 'src/app/models/Likes_cant';
import { Posts } from 'src/app/models/Posts';
import { Save } from 'src/app/models/Save';
import { BackendService } from 'src/app/services/backend.service';
import { Usuario2 } from 'src/app/models/Usuario2';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/Usuario';
import { ModificarCommComponent } from '../modificar-comm/modificar-comm.component';
import { Articulos } from 'src/app/models/Articulos';

// =============================================
// INTERFACES
// =============================================
interface Prenda {
  label: string;
  label_id: number;
  confidence: number;
  bbox: number[];
  colors: { vibrant: number[]; muted: number[]; third: number[]; };
  mask_b64?: string;
}

interface MakeupZone {
  id: number;
  zone: string;
  has_makeup: boolean;
  distance_to_skin: number;
  color_name?: string;      // ← OPCIONAL
  product_link?: string;    // ← OPCIONAL
  colors: { vibrant: number[]; muted: number[]; third: number[]; };
  bbox?: number[];
}

interface PostGuardado {
  id_post: number;
  descripcion: string;
  imagen: string;
  id_user: number;
  usuario: string;
  autor_imagen?: string;
  id_categoria?: number;
  name_categoria?: string;
  image_width?: number;
  image_height?: number;
  face_detected?: boolean;
  skin_reference_color?: number[] | null;
  prendas?: Prenda[];
  makeup_zones?: MakeupZone[];
  navegante?: number;
  _naturalWidth?: number;
  _naturalHeight?: number;
  _displayWidth?: number;
  _displayHeight?: number;
}

@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.scss']
})
export class GuardadosComponent implements OnInit {
  dataSource: any[] = [];
  dataSource2: any[] = [];
  dataSource4: PostGuardado[] = [];
  dataSource5: any[] = [];
  dataSource6: any[] = [];

  comentarios: { [key: number]: any[] } = {};
  perfil: { [key: number]: any } = {};
  likes: { [key: number]: any } = {};
  comentario: { [key: number]: string } = {};
  toggle: { [key: number]: boolean } = {};
  toggle1: { [key: number]: boolean } = {};
  mostrarMas: boolean[] = [];

  id_com: number = 0;
  id_lik: number = 0;
  id_us: number = 0;
  valores: any;
  id_new: number = 0;
  id_likes: number = 0;
  cant_like: number = 0;

  // Para expandir la descripción de los outfits
  outfitExpandido: { [key: number]: boolean } = {};

  usuariolog = Number(localStorage.getItem('ids'));

  constructor(
    private router: Router,
    private backend1: BackendService,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  showShortDesciption = true;

  descripcion: any = {
    descripcion: '',
    usuarios: '',
  };

  articulo: any = {
    id_post: 0,
    descripcion: '',
    imagen: '',
    id_user: 0,
    usuario: '',
    id_categoria: 0,
    name_categoria: '',
  };

  user: any = {
    id_user: 0,
    usuario: '',
    nombre: '',
    apellido: '',
    edad: '',
    sexo: '',
    correo: '',
    contrase: '',
    imagen: ''
  };

  activeTab = 'posts';
  status = 'Enable';
  variable: string = "";

  ngOnInit(): void {
    const routeId = this.activateRouter.snapshot.paramMap.get('id');
    const user = routeId ? routeId : localStorage.getItem('ids');

    this.backend1.obtenerUsuario(Number(user)).subscribe(y => {
      this.dataSource2 = y.datos;
      console.log(y.datos[0]);
    });

    this.backend1.PostPerfil(Number(user)).subscribe(async x => {
      this.dataSource = x.datos || [];
      console.log(x.datos);

      this.dataSource.forEach(post => {
        this.comentario[post.id_post] = '';
        this.toggle[post.id_post] = false;
        this.toggle1[post.id_post] = false;
      });

      for (let i = 0; i < this.dataSource.length; i++) {
        this.id_com = this.dataSource[i].id_post;
        this.id_us = this.dataSource[i].id_user;
        await this.obtenerComentariosAsync(this.id_com);
        await this.countLikeAsync(this.id_com);
        await this.obtenerPerfilAsync(this.id_us);
      }
      this.inicializarEstados();
    });

    this.backend1.getSave(Number(routeId ? routeId : localStorage.getItem('ids'))).subscribe(async m => {
      this.dataSource4 = m.datos || [];
      console.log(m.datos);

      this.dataSource4.forEach(post => {
        this.comentario[post.id_post] = '';
        this.toggle[post.id_post] = false;
        this.toggle1[post.id_post] = false;
      });

      for (let i = 0; i < this.dataSource4.length; i++) {
        this.id_com = this.dataSource4[i].id_post;
        await this.obtenerComentariosAsync(this.id_com);
        await this.countLikeAsync(this.id_com);
      }
    });

    this.backend1.obtenerOutfitsGuardados(Number(user)).subscribe(m => {
      this.dataSource6 = (m.datos || []).map((o: any) => {
        let parsed: any = {};
        try { parsed = JSON.parse(o.json_generado); } catch (e) { parsed = {}; }
        return { ...o, outfit: parsed };
      });
    });

    this.backend1.getSaveA(Number(routeId ? routeId : localStorage.getItem('ids'))).subscribe(async m => {
      this.dataSource5 = m.datos || [];
      console.log(m.datos);

      this.dataSource5.forEach(post => {
        this.comentario[post.id_post] = '';
        this.toggle[post.id_post] = false;
        this.toggle1[post.id_post] = false;
      });

      for (let i = 0; i < this.dataSource5.length; i++) {
        this.id_com = this.dataSource5[i].id_post;
        await this.obtenerComentariosAsyncA(this.id_com);
        await this.countLikeAsyncA(this.id_com);
      }
    });
  }

  // =============================================
  // HELPERS ASYNC
  // =============================================
  async obtenerComentariosAsyncA(id_com: number) {
    return new Promise<void>(resolve => {
      this.backend1.obtenerComentariosA(id_com).subscribe(async z => {
        this.comentarios[id_com] = z.datos;
        resolve();
      });
    });
  }

  async countLikeAsyncA(id_com: number) {
    return new Promise<void>(resolve => {
      this.backend1.countLikeA(id_com).subscribe(y => {
        this.likes[id_com] = y.datos[0];
        resolve();
      });
    });
  }

  async obtenerComentariosAsync(id_com: number) {
    return new Promise<void>(resolve => {
      this.backend1.obtenerComentarios(id_com).subscribe(async z => {
        this.comentarios[id_com] = z.datos;
        resolve();
      });
    });
  }

  async countLikeAsync(id_com: number) {
    return new Promise<void>(resolve => {
      this.backend1.countLike(id_com).subscribe(y => {
        this.likes[id_com] = y.datos[0];
        resolve();
      });
    });
  }

  async obtenerPerfilAsync(id_us: number) {
    return new Promise<void>(resolve => {
      this.backend1.obtenerUsuario(id_us).subscribe(async a => {
        this.perfil[id_us] = a.datos[0];
        resolve();
      });
    });
  }

  // =============================================
  // INTERACCIONES
  // =============================================
  like(post: number, index: number) {
    const id_new = localStorage.getItem('ids');
    if (id_new) {
      const navegante = parseInt(id_new);
      if (this.toggle[index]) {
        this.backend1.eliminarLike(post, navegante).subscribe(y => {
          this.toggle[index] = false;
          if (!this.likes[post]) this.likes[post] = { cantidad: 0 };
          if (this.likes[post].cantidad > 0) this.likes[post].cantidad--;
          this.actualizarEstadoLocalStorage();
        });
      } else {
        const listadoLikes = new Likes(post, navegante);
        this.backend1.guardarLikes(listadoLikes).subscribe(y => {
          this.toggle[index] = true;
          if (!this.likes[post]) this.likes[post] = { cantidad: 0 };
          this.likes[post].cantidad++;
          this.actualizarEstadoLocalStorage();
        });
      }
    }
  }

  comment(post: number) {
    const comentario = this.comentario[post];
    if (!comentario || comentario.trim() === '') return;

    const id_new = localStorage.getItem('ids');
    if (id_new) {
      const navegante = parseInt(id_new);
      const listadocoment = new Comments(post, navegante, comentario);
      this.backend1.guardarComentarios(listadocoment).subscribe(
        () => {
          this.comentario[post] = '';
          // Recargar comentarios sin recargar toda la página
          this.obtenerComentariosAsync(post);
        },
        error => console.error("Error al guardar comentario:", error)
      );
    }
  }

  save(post: number, index: number) {
    const id_new = localStorage.getItem('ids');
    if (id_new) {
      const navegante = parseInt(id_new);
      const listadoFav = new Save(post, navegante);

      if (this.isSaved(post)) {
        this.backend1.eliminarSave(post, navegante).subscribe(() => {
          localStorage.removeItem(`saveState_${post}`);
          this.toggle1[index] = false;
        }, error => console.error('Error al eliminar el guardado:', error));
      } else {
        this.backend1.guardarFavoritos(listadoFav).subscribe(() => {
          localStorage.setItem(`saveState_${post}`, 'true');
          this.toggle1[index] = true;
        }, error => console.error('Error al guardar el post:', error));
      }
    }
  }

  isSaved(post: number): boolean {
    return localStorage.getItem(`saveState_${post}`) === 'true';
  }

  private inicializarEstados() {
    for (let i = 0; i < this.dataSource.length; i++) {
      const post = this.dataSource[i].id_post;
      const likeState = localStorage.getItem(`likeState_${post}`);
      if (likeState) this.toggle[i] = JSON.parse(likeState);
      const saveState = localStorage.getItem(`saveState_${post}`);
      if (saveState) this.toggle1[i] = JSON.parse(saveState);
    }
  }

  private actualizarEstadoLocalStorage() {
    for (let i = 0; i < this.dataSource.length; i++) {
      const post = this.dataSource[i].id_post;
      localStorage.setItem(`likeState_${post}`, JSON.stringify(this.toggle[i]));
      localStorage.setItem(`saveState_${post}`, JSON.stringify(this.toggle1[i]));
    }
  }

  openMod(postid: number, id_comment: number) {
    const id_new = localStorage.getItem('ids');
    if (id_new) {
      const navegante = parseInt(id_new);
      this.dialog.open(ModificarCommComponent, {
        restoreFocus: false,
        id: 'mod',
        data: { id: postid, nav: navegante, comm: id_comment }
      });
    }
  }

  deleteComment(post: number, id_comment: number) {
    const id_new = localStorage.getItem('ids');
    if (id_new) {
      const navegante = parseInt(id_new);
      this.backend1.eliminarComentario(post, navegante, id_comment).subscribe(
        () => this.obtenerComentariosAsync(post),
        error => console.error("Error al eliminar comentario:", error)
      );
    }
  }

  unsavePost(post: number) {
    const id_new = localStorage.getItem('ids');
    if (!id_new) return;
    const navegante = parseInt(id_new);
    this.backend1.eliminarSave(post, navegante).subscribe(() => {
      localStorage.removeItem(`saveState_${post}`);
      this.dataSource = this.dataSource.filter(p => p.id_post !== post);
    });
  }

  unsaveOutfit(id_outfit: number) {
    this.backend1.eliminarOutfitGuardado(id_outfit).subscribe(() => {
      this.dataSource6 = this.dataSource6.filter(o => o.id_outfit !== id_outfit);
    });
  }

  unsaveGuardado(post: number) {
    const id_new = localStorage.getItem('ids');
    if (!id_new) return;
    const navegante = parseInt(id_new);
    this.backend1.eliminarSave(post, navegante).subscribe(() => {
      localStorage.removeItem(`saveState_${post}`);
      this.dataSource4 = this.dataSource4.filter(p => p.id_post !== post);
    });
  }

  unsaveArticulo(post: number) {
    const id_new = localStorage.getItem('ids');
    if (!id_new) return;
    const navegante = parseInt(id_new);
    this.backend1.eliminarSaveA(post, navegante).subscribe(() => {
      this.dataSource5 = this.dataSource5.filter(p => p.id_post !== post);
    });
  }

  isImage(fileName: string): boolean {
    if (!fileName) return false;
    return fileName.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
  }

  toggleLeerMas(index: number): void {
    this.mostrarMas[index] = !this.mostrarMas[index];
  }

  // =============================================
  // HOTSPOTS (prendas y maquillaje)
  // =============================================
  onImageLoad(event: any, articulo: any) {
    const img = event.target as HTMLImageElement;
    articulo._naturalWidth = img.naturalWidth;
    articulo._naturalHeight = img.naturalHeight;
    articulo._displayWidth = img.clientWidth;
    articulo._displayHeight = img.clientHeight;
  }

  getTopPosition(bbox: number[], articulo: any): string {
    if (!bbox || bbox.length !== 4 || !articulo._naturalHeight) return '0px';
    const y1 = bbox[1];
    const naturalH = articulo._naturalHeight;
    return `${(y1 / naturalH) * 100}%`;
  }

  getLeftPosition(bbox: number[], articulo: any): string {
    if (!bbox || bbox.length !== 4 || !articulo._naturalWidth) return '0px';
    const x1 = bbox[0];
    const naturalW = articulo._naturalWidth;
    return `${(x1 / naturalW) * 100}%`;
  }

  getMakeupTopPosition(zone: MakeupZone, articulo: any): string {
    if (!zone.bbox || !articulo._naturalHeight) return '50%';
    const y1 = zone.bbox[1];
    return `${(y1 / articulo._naturalHeight) * 100}%`;
  }

  getMakeupLeftPosition(zone: MakeupZone, articulo: any): string {
    if (!zone.bbox || !articulo._naturalWidth) return '50%';
    const x1 = zone.bbox[0];
    return `${(x1 / articulo._naturalWidth) * 100}%`;
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

  getSearchUrl(prenda: Prenda, articulo: any): string {
    const label = (prenda.label || '').split(',')[0].trim();
    return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(label)}`;
  }

  getMakeupSearchUrl(zone: MakeupZone, articulo: any): string {
    const color = zone.color_name || '';
    const zoneName = zone.zone || '';
    return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${zoneName} makeup ${color}`)}`;
  }
  toggleOutfitDesc(id: number) {
    this.outfitExpandido[id] = !this.outfitExpandido[id];
  }
}

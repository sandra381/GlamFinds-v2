import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario';
import { Usuario_ver } from '../models/Usuario_ver';
import { Response1 } from '../models/Response1';
import { Posts } from '../models/Posts';
import { Response2 } from '../models/Response2';
import { Likes } from '../models/Likes';
import { Response3 } from '../models/Response3';
import { Comments } from '../models/Comments';
import { Response4 } from '../models/Response4';
import { Save } from '../models/Save';
import { Response5 } from '../models/Response5';
import { Response41 } from '../models/Response41';
import { Response6 } from '../models/Response6';
import { PostGeneralesResponse } from '../models/PostGeneralesResponse';
import { PostsGenerales } from '../models/PostsGenerales';
import { Publicidad } from '../models/Publicidad';
import { PublicidadResponse2 } from '../models/PublicidadResponse2';
import { Response7 } from '../models/Response7';
import { Response8 } from '../models/Response8';
import { PublicidadResponse } from '../models/PublicidadResponse';
import { PerfilResponse } from '../models/PerfilResponse';
import { TextMessage } from '../models/text-message.model';
import { ResponseMessage } from '../models/response-message.model';
import { Observable } from 'rxjs';
import { ArticulosResponse } from '../models/ArticulosResponse';
import { Articulos } from '../models/Articulos';
import { Response2A } from '../models/Response2A';
import { Response51 } from '../models/Response51';

const be_api = environment.apiUrl;
const hhtoption = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

export interface Image {
  url_imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  projectId: any;
  constructor(private hhtclient: HttpClient) { }

  /*------------USUARIO-----------*/

  // Login (antes /verificar)
  ingresarMenu(user: Usuario_ver) {
    console.log(be_api + '/auth/login');
    console.log(user);
    return this.hhtclient.post<Response1>(be_api + '/auth/login', user, hhtoption);
  }

  // Registro (antes /login)
  guardarUsuarioConImagen(formData: FormData, userData: any): Observable<any> {
    const url = `${be_api}/auth/register`;
    formData.append('usuario', userData.usuario);
    formData.append('nombre', userData.nombre);
    formData.append('apellido', userData.apellido);
    formData.append('edad', userData.edad);
    formData.append('sexo', userData.sexo);
    formData.append('correo', userData.correo);
    formData.append('contrase', userData.contrase);
    formData.append('descripcion', userData.descripcion);
    return this.hhtclient.post(url, formData);
  }

  // Obtener perfil de usuario (antes /user:id)
  obtenerUsuario(id_user: number) {
    return this.hhtclient.get<Response7>(be_api + '/users/' + id_user, hhtoption);
  }

  // Obtener descripción (antes /getdescripcion:id)
  getdescripcion(id_user: number) {
    console.log(be_api + '/users/getdescripcion');
    return this.hhtclient.get<PerfilResponse>(be_api + '/users/getdescripcion/' + id_user, hhtoption);
  }

  // Obtener posts guardados (antes /getsave:id)
  getSave(id_user: number) {
    console.log(be_api + '/users/getsave');
    return this.hhtclient.get<Response2>(be_api + '/users/getsave/' + id_user, hhtoption);
  }

  // (antes /PostDes:id) - probablemente obsoleto, pero se mantiene
  PostDes(id_user: number) {
    console.log(be_api + '/users/PostDes');
    return this.hhtclient.get<Response2>(be_api + '/users/PostDes/' + id_user, hhtoption);
  }

  // Obtener posts del perfil (antes /PostPerfil:id)
  PostPerfil(id_user: number) {
    console.log(be_api + '/users/PostPerfil');
    return this.hhtclient.get<Response2>(be_api + '/users/PostPerfil/' + id_user, hhtoption);
  }

  // Actualizar perfil (antes /update2/:id)
  editarPosts2(id: number, formData: FormData) {
    return this.hhtclient.put<Response2>(be_api + '/users/update2/' + id, formData);
  }

  /*-----------POST GENERALES------------*/

  // Crear post (antes /agregarPost)
  insertarPosts(formData: FormData, userData: any): Observable<any> {
    const url = `${be_api}/posts/agregar`;
    console.log(be_api + '/posts/agregar');
    formData.append('descripcion', userData.descripcion);
    formData.append('autor', userData.autor);
    formData.append('categoria', userData.categoria);
    return this.hhtclient.post<PostGeneralesResponse>(url, formData);
  }

  // Likes
  guardarLikes(likes: Likes) {
    console.log(be_api + '/interactions/likes');
    console.log(likes);
    return this.hhtclient.post<Response3>(be_api + '/interactions/likes', likes, hhtoption);
  }

  // Comentarios (antes /comments)
  guardarComentarios(comment: Comments) {
    console.log(be_api + '/interactions/comments');
    console.log(comment);
    return this.hhtclient.post<Response4>(be_api + '/interactions/comments', comment, hhtoption);
  }

  // Guardar favoritos (antes /save)
  guardarFavoritos(save: Save) {
    console.log(be_api + '/interactions/save');
    console.log(save);
    return this.hhtclient.post<Response5>(be_api + '/interactions/save', save, hhtoption);
  }

  // Obtener comentarios de un post (antes /getComentarios:id)
  obtenerComentarios(id_post: number) {
    console.log(be_api + '/interactions/getComentarios');
    return this.hhtclient.get<Response41>(be_api + '/interactions/getComentarios/' + id_post, hhtoption);
  }

  // Contar likes (antes /countLike:id)
  countLike(id_post: number) {
    console.log(be_api + '/interactions/countLike');
    return this.hhtclient.get<Response6>(be_api + '/interactions/countLike/' + id_post, hhtoption);
  }

  // Eliminar like (antes /borrarLikes/:id/:id2)
  eliminarLike(postId: number, navegante: number) {
    return this.hhtclient.delete<Posts>(be_api + '/interactions/borrarLikes/' + postId + '/' + navegante, hhtoption);
  }

  // Eliminar save (antes /borrarSaves/:id/:id2)
  eliminarSave(postId: number, navegante: number) {
    return this.hhtclient.delete<Posts>(be_api + '/interactions/borrarSaves/' + postId + '/' + navegante, hhtoption);
  }

  // Modificar comentario (antes /updateCom/:id)
  modificarComentario(id_comment: number, comentario: Comments) {
    return this.hhtclient.post<Response2>(be_api + '/interactions/updateCom/' + id_comment, comentario);
  }

  // Eliminar comentario (antes /borrarComment/:id/:id2/:id3)
  eliminarComentario(postId: number, navegante: number, id_comment: number) {
    return this.hhtclient.delete<Posts>(be_api + '/interactions/borrarComment/' + postId + '/' + navegante + '/' + id_comment, hhtoption);
  }

  // Obtener comentario (antes /getComment/:id/:id2/:id3)
  obtenerComentarioUser(postId: number, navegante: number, id_comment: number) {
    return this.hhtclient.get<Response7>(be_api + '/interactions/getComment/' + postId + '/' + navegante + '/' + id_comment, hhtoption);
  }

  /*-----------POST PUBLICACIONES (PUBLICIDAD)------------*/

  // Crear post de publicidad (antes /agregarPostP)
  insertarPostsP(formData: FormData, userData: any): Observable<any> {
    const url = `${be_api}/posts/publicidad`;
    console.log(be_api + '/posts/publicidad');
    formData.append('descripcion', userData.descripcion);
    formData.append('autor', userData.autor);
    formData.append('link', userData.link);
    formData.append('categoria', userData.categoria);
    return this.hhtclient.post<PublicidadResponse>(url, formData);
  }

  // Obtener dups (antes /getDups)
  obtenerDups() {
    console.log(be_api + '/posts/publicidad/dups');
    return this.hhtclient.get<PublicidadResponse>(be_api + '/posts/publicidad/dups', hhtoption);
  }

  // Obtener descuentos (antes /getDescuentos)
  obtenerDescuentos() {
    console.log(be_api + '/posts/publicidad/descuentos');
    return this.hhtclient.get<PublicidadResponse>(be_api + '/posts/publicidad/descuentos', hhtoption);
  }

  // Interacciones para publicidad (P)
  obtenerComentarioP(id_post: number) {
    console.log(be_api + '/interactions/getCommentsP');
    return this.hhtclient.get<Response41>(be_api + '/interactions/getCommentsP/' + id_post, hhtoption);
  }

  countLikeP(id_post: number) {
    console.log(be_api + '/interactions/countLikeP');
    return this.hhtclient.get<Response6>(be_api + '/interactions/countLikeP/' + id_post, hhtoption);
  }

  guardarComentariosP(comment: Comments) {
    console.log(be_api + '/interactions/commentsP');
    console.log(comment);
    return this.hhtclient.post<Response4>(be_api + '/interactions/commentsP', comment, hhtoption);
  }

  guardarLikesP(likes: Likes) {
    console.log(be_api + '/interactions/likesP');
    console.log(likes);
    return this.hhtclient.post<Response3>(be_api + '/interactions/likesP', likes, hhtoption);
  }

  guardarFavoritosP(save: Save) {
    console.log(be_api + '/interactions/saveP');
    console.log(save);
    return this.hhtclient.post<Response5>(be_api + '/interactions/saveP', save, hhtoption);
  }

  eliminarLikeP(postId: number, navegante: number) {
    return this.hhtclient.delete<Posts>(be_api + '/interactions/borrarLikesP/' + postId + '/' + navegante, hhtoption);
  }

  eliminarSaveP(postId: number, navegante: number) {
    return this.hhtclient.delete<Posts>(be_api + '/interactions/borrarSavesP/' + postId + '/' + navegante, hhtoption);
  }

  modificarComentarioP(id_comment: number, comentario: Comments) {
    return this.hhtclient.post<Response2>(be_api + '/interactions/updateComP/' + id_comment, comentario);
  }

  eliminarComentarioP(postId: number, navegante: number, id_comment: number) {
    return this.hhtclient.delete<Posts>(be_api + '/interactions/borrarCommentP/' + postId + '/' + navegante + '/' + id_comment, hhtoption);
  }

  obtenerComentarioUserP(postId: number, navegante: number, id_comment: number) {
    return this.hhtclient.get<Response7>(be_api + '/interactions/getCommentP/' + postId + '/' + navegante + '/' + id_comment, hhtoption);
  }

  ////////ADMIN (obsoleto, pero se mantiene)

  borrarTendencia(tendencias: number) {
    return this.hhtclient.delete<Posts>(be_api + '/posts/' + tendencias, hhtoption);
  }

  insertarPubli(users: Publicidad) {
    console.log(be_api + '/posts/publicidad');
    return this.hhtclient.post<Response2>(be_api + '/posts/publicidad', users, hhtoption);
  }

  obtenerGeneral(id: number) {
    console.log(be_api + '/posts/' + id);
    return this.hhtclient.get<Response2>(be_api + '/posts/' + id, hhtoption);
  }

  editarPosts(id: number, posts: Posts) {
    return this.hhtclient.put<PostGeneralesResponse>(be_api + '/posts/' + id, posts);
  }

  // extraer colores
  getColors(imageUrl: string): Observable<any> {
    return this.hhtclient.post<any>(be_api + '/tools/extract-colors', { imageUrl });
  }

  generarLookAleatorio(): Observable<any> {
    return this.hhtclient.get<Response2>(be_api + '/tools/generar-look', hhtoption);
  }

  generarLookAleatorioM(): Observable<any> {
    return this.hhtclient.get<Response2>(be_api + '/tools/generar-lookM', hhtoption);
  }

  obtenerPrenda() {
    console.log(be_api + '/tools/obtenerprenda');
    return this.hhtclient.get<any>(be_api + '/tools/obtenerprenda', hhtoption);
  }

  Prenda(): Observable<any> {
    console.log(be_api + '/tools/prendas');
    return this.hhtclient.get<Response2>(be_api + '/tools/prendas', hhtoption);
  }

  //Articulos (ahora en /articles)
  insertarArticulos(formData: FormData): Observable<any> {
    const url = `${be_api}/articles/crear`;
    return this.hhtclient.post<ArticulosResponse>(url, formData);
}

  obtenerArticulos() {
    console.log(be_api + '/articles/obtenerArticulos');
    return this.hhtclient.get<ArticulosResponse>(be_api + '/articles/obtenerArticulos', hhtoption);
  }

  guardarLikesA(likes: Likes) {
    console.log(be_api + '/articles/likesART');
    console.log(likes);
    return this.hhtclient.post<Response3>(be_api + '/articles/likesART', likes, hhtoption);
  }

  guardarComentariosA(comment: Comments) {
    console.log(be_api + '/articles/commentsART');
    console.log(comment);
    return this.hhtclient.post<Response4>(be_api + '/articles/commentsART', comment, hhtoption);
  }

  guardarFavoritosA(save: Save) {
    console.log(be_api + '/articles/saveART');
    console.log(save);
    return this.hhtclient.post<Response5>(be_api + '/articles/saveART', save, hhtoption);
  }

  obtenerComentariosA(id_post: number) {
    console.log(be_api + '/articles/getComentariosART');
    return this.hhtclient.get<Response51>(be_api + '/articles/getComentariosART/' + id_post, hhtoption);
  }

  countLikeA(id_post: number) {
    console.log(be_api + '/articles/countLikeART');
    return this.hhtclient.get<Response6>(be_api + '/articles/countLikeART/' + id_post, hhtoption);
  }

  eliminarLikeA(postId: number, navegante: number) {
    return this.hhtclient.delete<Articulos>(be_api + '/articles/borrarLikesART/' + postId + '/' + navegante, hhtoption);
  }

  eliminarSaveA(postId: number, navegante: number) {
    return this.hhtclient.delete<Articulos>(be_api + '/articles/borrarSavesART/' + postId + '/' + navegante, hhtoption);
  }

  modificarComentarioA(id_comment: number, comentario: Comments) {
    return this.hhtclient.post<Response2A>(be_api + '/articles/updateComART/' + id_comment, comentario);
  }

  eliminarComentarioA(postId: number, navegante: number, id_comment: number) {
    return this.hhtclient.delete<Articulos>(be_api + '/articles/borrarCommentART/' + postId + '/' + navegante + '/' + id_comment, hhtoption);
  }

  obtenerComentarioUserA(postId: number, navegante: number, id_comment: number) {
    return this.hhtclient.get<Response7>(be_api + '/articles/getCommentART/' + postId + '/' + navegante + '/' + id_comment, hhtoption);
  }

  getSaveA(id_user: number) {
    console.log(be_api + '/articles/getsaveA');
    return this.hhtclient.get<Response2A>(be_api + '/articles/getsaveA/' + id_user, hhtoption);
  }

  getNews(): Observable<any[]> {
    return this.hhtclient.get<any[]>(be_api + '/tools/api-fashion-trends', hhtoption);
  }

  //-----------------Nuevas funciones -----------------
  getUserStats(userId: number): Observable<any> {
    return this.hhtclient.get<any>(be_api + '/users/user-stats/' + userId, hhtoption);
  }

  obtenerFeed(): Observable<any> {
    console.log(be_api + '/posts/obtener');
    return this.hhtclient.get<Response2>(be_api + '/posts/obtener', hhtoption);
  }

  obtenerFeedTendencias(): Observable<any> {
    return this.hhtclient.get<any>(be_api + '/feed/trending', hhtoption);
  }

  obtenerFeedSiguiendo(userId: number): Observable<any> {
    return this.hhtclient.get<any>(be_api + '/feed/following/' + userId, hhtoption);
  }

  obtenerCategorias(): Observable<any> {
    return this.hhtclient.get<any>(be_api + '/feed/categorias', hhtoption);
  }

  actualizarPreferencias(id_post: number) {
    const id_user = Number(localStorage.getItem('ids'));
    return this.hhtclient.post(be_api + '/feed/actualizarPreferencias', { id_user, id_post }, hhtoption);
  }

  obtenerFeedParaTi(userId: number): Observable<any> {
    return this.hhtclient.get<any>(be_api + '/feed/parati/' + userId, hhtoption);
  }

  //outfit del dia con ia (ahora en /outfit)
  generarOutfitIA(ocasion: string, clima: string, colores: string[]): Observable<any> {
    return this.hhtclient.post<any>(be_api + '/outfit/generar', { ocasion, clima, colores }, hhtoption);
  }

  guardarOutfitIA(id_usuario: number, jsonGenerado: any): Observable<any> {
    return this.hhtclient.post<any>(be_api + '/outfit/guardar', { id_usuario, json_generado: jsonGenerado }, hhtoption);
  }

  obtenerOutfitsGuardados(id_usuario: number): Observable<any> {
    return this.hhtclient.get<any>(be_api + '/outfit/guardados/' + id_usuario, hhtoption);
  }

  eliminarOutfitGuardado(id_outfit: number): Observable<any> {
    return this.hhtclient.delete<any>(be_api + '/outfit/eliminar/' + id_outfit, hhtoption);
  }
}

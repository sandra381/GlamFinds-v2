export class Comments2 {
    post: number;
    navegante: number;
    usuario: string;
    comments: string;
    id_comment: number;
    usuario_imagen?: string;

    constructor(post: number, navegante: number, usuario: string, comments: string, id_comment: number, usuario_imagen?: string) {
        this.post = post;
        this.navegante = navegante;
        this.usuario = usuario;
        this.comments = comments;
        this.id_comment = id_comment;
        this.usuario_imagen = usuario_imagen;
    }
}

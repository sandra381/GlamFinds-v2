import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ===== COMPONENTES DE AUTENTICACIÓN =====
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// ===== COMPONENTES DE FEED =====
import { FeedComponent } from './components/feed/feed.component';
import { TrendingComponent } from './components/trending/trending.component';
import { FollowingComponent } from './components/following/following.component';
import { ParatiComponent } from './components/parati/parati.component';

// ===== COMPONENTES DE PERFIL =====
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';

// ===== COMPONENTES DE PUBLICACIÓN =====
import { PostCreateComponent } from './components/post-create/post-create.component';

// ===== COMPONENTES DE ARTÍCULOS =====
import { ArticleComponent } from './components/article/article.component';

// ===== COMPONENTES DE HERRAMIENTAS =====
import { MoodboardComponent } from './components/moodboard/moodboard.component';
import { RandlookComponent } from './components/randlook/randlook.component';
import { TryonComponent } from './components/tryon/tryon.component';
import { OutfitIaComponent } from './components/outfit-ia/outfit-ia.component';

// ===== COMPONENTES DE INFORMACIÓN =====
import { NewsComponent } from './components/news/news.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ModificarCommComponent } from './components/modificar-comm/modificar-comm.component';
import { MenuHorizontalComponent } from './components/menu-horizontal/menu-horizontal.component';

const routes: Routes = [
  // ===== AUTENTICACIÓN =====
  { path: '', component: LoginComponent },
  { path: 'registrar', component: RegisterComponent },

  // ===== FEEDS PRINCIPALES =====
  { path: 'feed', component: FeedComponent },                    // Feed unificado (todas las categorías)
  { path: 'tendencias', component: TrendingComponent },          // Feed de tendencias (algorítmico)
  { path: 'siguiendo', component: FollowingComponent },          // Feed de usuarios seguidos
  { path: 'parati', component: ParatiComponent },
    {path:'menu2/:id' ,component: MenuHorizontalComponent},               // Feed personalizado "Para ti"

  // ===== PERFIL =====
  { path: 'perfil', component: ProfileComponent },              // Perfil propio
  { path: 'perfil/:id', component: ProfileComponent },          // Perfil de otro usuario
  { path: 'configuracion', component: ProfileEditComponent },   // Editar perfil

  // ===== PUBLICACIONES =====
  { path: 'agregar', component: PostCreateComponent },          // Crear nuevo post
  { path: 'editar/:id', component: PostCreateComponent },        // Editar post existente
  { path: 'modComment', component: ModificarCommComponent }, // Editar comentario existente

  // ===== ARTÍCULOS =====
  { path: 'articulo', component: ArticleComponent },            // Artículos de moda

  // ===== HERRAMIENTAS =====
  { path: 'moodboard', component: MoodboardComponent },         // Editor de moodboards
  { path: 'randlook', component: RandlookComponent },           // Generador de looks aleatorios
  { path: 'tryon', component: TryonComponent },                 // Armario virtual
  { path: 'outfit-ia', component: OutfitIaComponent },          // Generador de outfits con IA

  // ===== INFORMACIÓN =====
  { path: 'noticias', component: NewsComponent },               // Noticias de moda
  { path: 'asistente', component: ChatbotComponent },           // Chatbot/Asistente IA

  // ===== REDIRECCIÓN POR DEFECTO (404) =====
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

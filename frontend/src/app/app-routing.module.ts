import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// ===== COMPONENTES DE AUTENTICACIÓN (SIN GUARD) =====
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// ===== COMPONENTES DE FEED =====
import { FeedComponent } from './components/feed/feed.component';
import { TrendingComponent } from './components/trending/trending.component';
import { FollowingComponent } from './components/following/following.component';
import { ParatiComponent } from './components/parati/parati.component';

// ===== COMPONENTES DE PERFIL =====
import { ProfileComponent } from './components/profile/profile.component';

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

import { GuardadosComponent } from './components/guardados/guardados.component';

const routes: Routes = [
  // ===== AUTENTICACIÓN (SIN GUARD) =====
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegisterComponent },

  // ===== FEEDS (CON GUARD) =====
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'tendencias', component: TrendingComponent, canActivate: [AuthGuard] },
  { path: 'siguiendo', component: FollowingComponent, canActivate: [AuthGuard] },
  { path: 'parati', component: ParatiComponent, canActivate: [AuthGuard] },

  // ===== PERFIL (CON GUARD) =====
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'perfil/:id', component: ProfileComponent, canActivate: [AuthGuard] },

  // ===== PUBLICACIONES (CON GUARD) =====
  { path: 'agregar', component: PostCreateComponent, canActivate: [AuthGuard] },

  // ===== ARTÍCULOS (CON GUARD) =====
  { path: 'articulo', component: ArticleComponent, canActivate: [AuthGuard] },

  // ===== HERRAMIENTAS (CON GUARD) =====
  { path: 'moodboard', component: MoodboardComponent, canActivate: [AuthGuard] },
  { path: 'randlook', component: RandlookComponent, canActivate: [AuthGuard] },
  { path: 'tryon', component: TryonComponent, canActivate: [AuthGuard] },
  { path: 'outfit-ia', component: OutfitIaComponent, canActivate: [AuthGuard] },

  // ===== INFORMACIÓN (CON GUARD) =====
  { path: 'noticias', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'asistente', component: ChatbotComponent, canActivate: [AuthGuard] },

  // ===== GUARDADOS (CON GUARD) =====
  { path: 'guardados', component: GuardadosComponent, canActivate: [AuthGuard] },

  // ===== REDIRECCIÓN POR DEFECTO (404) =====
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

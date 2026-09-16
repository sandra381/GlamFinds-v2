import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatDialogModule} from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from '@angular/common/http';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MoodboardComponent } from './components/moodboard/moodboard.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RandlookComponent } from './components/randlook/randlook.component';
import { OutfitIaComponent } from './components/outfit-ia/outfit-ia.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FeedComponent } from './components/feed/feed.component';
import { TrendingComponent } from './components/trending/trending.component';
import { FollowingComponent } from './components/following/following.component';
import { ParatiComponent } from './components/parati/parati.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { ArticleComponent } from './components/article/article.component';
import { TryonComponent } from './components/tryon/tryon.component';
import { NewsComponent } from './components/news/news.component';
import { BackendService } from './services/backend.service';
import { ModificarCommComponent } from './components/modificar-comm/modificar-comm.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { MenuHorizontalComponent } from './components/menu-horizontal/menu-horizontal.component';
import { ArticuloCreateComponent } from './components/articulo-create/articulo-create.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { GuardadosComponent } from './components/guardados/guardados.component';
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    TrendingComponent,
    FollowingComponent,
    ParatiComponent,
    ProfileComponent,
    PostCreateComponent,
    ArticleComponent,
    MoodboardComponent,
    RandlookComponent,
    TryonComponent,
    OutfitIaComponent,
    NewsComponent,
    ChatbotComponent,
    ModificarCommComponent,
    MenuLateralComponent,
    MenuHorizontalComponent,
    ArticuloCreateComponent,
    GuardadosComponent,
    ImageUrlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatMenuModule,
    HttpClientModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatTooltipModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatGridListModule,
    MatInputModule,
    MatSnackBarModule,
    DragDropModule,
    EditorModule,


  ],
  providers: [
    BackendService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }


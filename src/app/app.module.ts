import { APP_INITIALIZER, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from '@coreui/angular';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MarkdownModule } from 'ngx-markdown';
import { AppConfigService } from 'src/config/app-config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PasswordPipe } from './common/password.pipe';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { DisallowSpacesDirective } from './directives/disallow-spaces.directive';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AboutComponent } from './main/about/about.component';
import { ContactComponent } from './main/contact/contact.component';
import { HomeComponent } from './main/home/home.component';
import { RpiCanvasComponent } from './main/projects/personal/rpi-canvas/rpi-canvas.component';
import { PersonalWebsiteComponent } from './main/projects/personal/personal-website/personal-website.component';
import { ProjectsComponent } from './main/projects/projects.component';
import { CardComponent } from './main/shared-components/card/card.component';
import { DialogComponent } from './main/shared-components/dialog/dialog.component';
import { SpinnerComponent } from './main/spinner/spinner.component';
import { StreamingContentComponent } from './main/streaming/streaming-content/streaming-content.component';
import { StreamingMoviesComponent } from './main/streaming/streaming-movies/streaming-movies.component';
import { StreamingTvComponent } from './main/streaming/streaming-tv/streaming-tv.component';
import { StreamingComponent } from './main/streaming/streaming.component';
import { TestingComponent } from './main/testing/testing.component';
import { ThemeComponent } from './main/theme/theme.component';
import { ForgotCredentialsComponent } from './main/user-auth/forgot-credentials/forgot-credentials.component';
import { LoginComponent } from './main/user-auth/login/login.component';
import { ResetCredentialsComponent } from './main/user-auth/reset-credentials/reset-credentials.component';
import { SignupComponent } from './main/user-auth/signup/signup.component';
import { UserModActionComponent } from './main/user-mod/user-mod-action/user-mod-action.component';
import { UserModComponent } from './main/user-mod/user-mod.component';
import { UserSettingsComponent } from './main/user-settings/user-settings.component';
import { MaterialModule } from './material-module';
import { CatComponent } from './main/cat/cat.component';
import { LIGHTBOX_CONFIG, LightboxConfig } from 'ng-gallery/lightbox';
import { GALLERY_CONFIG, GalleryConfig, GalleryModule } from 'ng-gallery';

export function initConfig(
  configService: AppConfigService
) {
  return () =>
    configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    SpinnerComponent,
    ProjectsComponent,
    RpiCanvasComponent,
    PersonalWebsiteComponent,
    BlockCopyPasteDirective,
    StreamingContentComponent,
    LoginComponent,
    SignupComponent,
    StreamingComponent,
    StreamingMoviesComponent,
    StreamingTvComponent,
    UserModComponent,
    UserModActionComponent,
    DialogComponent,
    ForgotCredentialsComponent,
    ResetCredentialsComponent,
    PasswordPipe,
    DisallowSpacesDirective,
    UserSettingsComponent,
    CardComponent,
    TestingComponent,
    ThemeComponent,
    ContactComponent,
    CatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    PdfViewerModule,
    MatFormFieldModule,
    MatInputModule,
    MarkdownModule.forRoot({ loader: HttpClient, sanitize: SecurityContext.NONE }),
    MarkdownModule.forChild(),
    InfiniteScrollModule,
    ScrollingModule,
    MatSidenavModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgOptimizedImage,
    GalleryModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover'
      } as GalleryConfig
    },
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false,
        exitAnimationTime: 1000
      } as LightboxConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

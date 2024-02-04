import { HttpClient } from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AboutComponent } from './main/about/about.component';
import { ContactComponent } from './main/contact/contact.component';
import { HomeComponent } from './main/home/home.component';
import { RpiCanvasComponent } from './main/projects/personal/rpi-canvas/rpi-canvas.component';
import { ProjectsComponent } from './main/projects/projects.component';
import { ForgotCredentialsComponent } from './main/user-auth/forgot-credentials/forgot-credentials.component';
import { LoginComponent } from './main/user-auth/login/login.component';
import { ResetCredentialsComponent } from './main/user-auth/reset-credentials/reset-credentials.component';
import { SignupComponent } from './main/user-auth/signup/signup.component';
import { UserModComponent } from './main/user-mod/user-mod.component';
import { UserSettingsComponent } from './main/user-settings/user-settings.component';
import { CatComponent } from './main/cat/cat.component';
import { PersonalWebsiteComponent } from './main/projects/personal/personal-website/personal-website.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'user-auth/login',
		component: LoginComponent
	},
	{
		path: 'user-auth/signup',
		component: SignupComponent
	},
	{
		path: 'user-auth/forgot',
		component: ForgotCredentialsComponent
	},
	{
		path: 'user-auth/update/email',
		component: ResetCredentialsComponent
	},
	{
		path: 'user-auth/update/username',
		component: ResetCredentialsComponent
	},
	{
		path: 'user-auth/update/password',
		component: ResetCredentialsComponent
	},
	{
		path: 'user-auth/delete',
		component: ResetCredentialsComponent
	},
	{
		path: 'user-auth/reset/username',
		component: ResetCredentialsComponent
	},
	{
		path: 'user-auth/reset/password',
		component: ResetCredentialsComponent
	},
	{
		path: 'user-auth/reset/username_and_password',
		component: ResetCredentialsComponent
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'cat',
		component: CatComponent
	},
	{
		path: 'settings',
		component: UserSettingsComponent
	},
	// {
	// 	path: 'streaming',
	// 	component: StreamingComponent
	// },
	// {
	// 	path: 'streaming/movies',
	// 	component: StreamingMoviesComponent
	// },
	// {
	// 	path: 'streaming/tv',
	// 	component: StreamingTvComponent
	// },
	{
		path: 'projects',
		component: ProjectsComponent
	},
	{
		path: 'projects/personal',
		component: ProjectsComponent
	},
	{
		path: 'projects/personal/raspberry-pi-canvas',
		component: RpiCanvasComponent
	},
	{
		path: 'projects/personal/website',
		component: PersonalWebsiteComponent
	},
	{
		path: 'projects/work',
		component: ProjectsComponent
	},
	{
		path: 'user-mod',
		component: UserModComponent
	},
	{
		path: 'contact',
		component: ContactComponent
	},

];


@NgModule({
	imports: [
		RouterModule.forRoot(
			// @ts-ignore
			window['mobile'] === 'true' ? mobileRoutes : routes
		),
		MarkdownModule.forRoot({ loader: HttpClient, sanitize: SecurityContext.NONE }),
		MarkdownModule.forChild()
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }

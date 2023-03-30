import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { ContenidoComponent } from './componentes/contenido/contenido.component';
import { RegistrarUsuarioComponent } from './componentes/registrar-usuario/registrar-usuario.component';
import { VerificarCorreoComponent } from './componentes/verificar-correo/verificar-correo.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//importamos angular fire module
import {AngularFireModule} from '@angular/fire/compat'
import {environment} from '../environments/environment'

//lo importamos para usar firebase storage
import {AngularFireStorageModule} from '@angular/fire/compat/storage'

//importamos HttpClientModule
import {HttpClientModule} from '@angular/common/http';
import { FormularioComponent } from './componentes/formulario/formulario.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContenidoComponent,
    RegistrarUsuarioComponent,
    VerificarCorreoComponent,
    RecuperarPasswordComponent,
    SpinnerComponent,
    FormularioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCViFcSf7gg9A-eUJdIqF4UbqRZIawWSuo",
      authDomain: "login-angular-53533.firebaseapp.com",
      projectId: "login-angular-53533",
      storageBucket: "login-angular-53533.appspot.com",
      messagingSenderId: "262228453647",
      appId: "1:262228453647:web:ffb5317973a2e81b39f67a"
    }),

    HttpClientModule,

    AngularFireStorageModule,

    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

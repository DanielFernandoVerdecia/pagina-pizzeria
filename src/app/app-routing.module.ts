import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { ContenidoComponent } from './componentes/contenido/contenido.component';
import { LoginComponent } from './componentes/login/login.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { RegistrarUsuarioComponent } from './componentes/registrar-usuario/registrar-usuario.component';
import { VerificarCorreoComponent } from './componentes/verificar-correo/verificar-correo.component';
import { GuardianService } from './guardian.service';

const guardian_contenido = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
)=>{
  return inject(GuardianService).canActive()
}

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component:LoginComponent},
  {path: 'verificar-correo', component: VerificarCorreoComponent},
  {path: 'registrar-usuario', component: RegistrarUsuarioComponent},
  {path: 'recuperar-passsword', component: RecuperarPasswordComponent},
  {path: 'contenido', component: ContenidoComponent, canActivate: [guardian_contenido]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardianService {

  constructor(
    private router: Router
  ) { }

  mensaje_loguearse_primero = false


  canActive(){

    
    //esto es para proteger las rutas, en caso de que no haya ningun token guardado no se permitirá
    //navegar por la ruta
    if(localStorage.getItem('user_token') == null){

      this.router.navigate(['/login'])

      this.mensaje_loguearse_primero = true

      return false

      
    }

    //en caso que haya un token, es decir que el usuario se haya logueado entonces se va a permitir
    //navegar por la ruta
    else{
      return true
    }

  }



}

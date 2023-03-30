import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import {AngularFireAuth} from '@angular/fire/compat/auth'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent {

  recuperar_password: FormGroup


  mostrar_carga = false

  constructor(
    private form_builder: FormBuilder,
    private auth: AngularFireAuth,

    private router: Router
  
  ){

    this.recuperar_password = this.form_builder.group({
      email: ['', [Validators.required, Validators.email]]
    })
    
  }

  restablecer_password(){
    
    this.mostrar_carga = true
   const email = this.recuperar_password.value.email


   console.log(this.recuperar_password)

    this.auth.sendPasswordResetEmail(email)
    .then(
      ()=>{

        
        this.mensaje("")
        this.router.navigate(['/login'])

      }
    )
    .catch(
      (error)=>{
        this.mensaje(error.code)

        this.mostrar_carga = false
      }
    )

  }

  mensaje(tipo_error:string){

    if(tipo_error == "auth/invalid-email"){
      Swal.fire({
        icon: 'error',
        title: 'Error al acceder a su correo',
        text: 'El formato de email es invalido, recuerde escribir "@" seguido del servicio de email, y después ".com"',
      });
    }

    else if(tipo_error == "auth/user-not-found"){
      Swal.fire({
        icon: 'error',
        title: 'Error al acceder a su correo',
        text: 'El usuario al que intenta acceder no existe',
      });
    }

    else{

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se ha enviado un mensaje a su correo, revisalo',
        showConfirmButton: false,
        timer: 6000
      })

    }

  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AngularFireAuth} from '@angular/fire/compat/auth'
import * as firebase from 'firebase/auth'

import { Router } from '@angular/router';


import Swal from 'sweetalert2';
import { GuardianService } from 'src/app/guardian.service';


//importamos HttpClient
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  login: FormGroup

  mostrar_carga = false


  constructor(
    private form_builder: FormBuilder,

    private auth: AngularFireAuth,

    private router: Router,


    private guardian_service: GuardianService,

    private http: HttpClient

  ){
    this.login = this.form_builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
    if(this.guardian_service.mensaje_loguearse_primero){
  
      Swal.fire({
        icon: 'error',
        title: 'Es necesario iniciar sesión',
        text: 'para que pueda ver su contenido inicie sesión',

      })
    }

    this.guardian_service.mensaje_loguearse_primero = false

    
  }

  iniciar_sesion(){

    const emaill = this.login.value.email
    const password = this.login.value.password

    this.mostrar_carga = true
    
    this.auth.signInWithEmailAndPassword(emaill, password)
    .then(
      (respuesta)=>{


        if(respuesta.user?.emailVerified == true){
          

          firebase.getAuth().currentUser?.getIdToken().then(
            (token_obtenido)=>{
              //guardamos el token obtenido, esto es para que una vez inciado sesion no sea neceaario 
              //volver a inicar otra vez sesion debido a que el token no fue almacenado
              localStorage.setItem('user_token', token_obtenido)

             

              
              const id_usuario = respuesta.user?.uid

              //guardamos el id del usuario para acceder después en cotenido.component.ts 
              //usando el get
              localStorage.setItem('id_user', String(id_usuario))

              this.router.navigate(['/contenido'])
              this.mensaje("")

              

              

            }
          )
          

        }

        else{
          this.router.navigate(['/verificar-correo'])
        }

      }
    )
    .catch(
      (error)=>{
        console.log(error.code)

        this.mostrar_carga = false

        this.mensaje(error.code)


      }
    )

  }

  mensaje(tipo_error: string){

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

    else if(tipo_error == "auth/wrong-password"){

      Swal.fire({
        icon: 'error',
        title: 'Error al acceder a su correo',
        text: 'La contraseña es incorrecta',
      });

    }

    else{

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bienvenido',
        showConfirmButton: false,
        timer: 3000
      })

    }

   

  }

}

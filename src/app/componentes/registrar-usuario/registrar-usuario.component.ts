import { FormStyle } from '@angular/common';
import { Component } from '@angular/core';

import {FormGroup, FormBuilder, Validators} from '@angular/forms'

import {AngularFireAuth} from '@angular/fire/compat/auth'
import * as firebase from 'firebase/auth'

import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router';

//importamos HttpClient
import { HttpClient } from '@angular/common/http';
import { ConstantPool } from '@angular/compiler';


@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent {

  registrar_usuario: FormGroup

  mostrar_carga = false

  rol_actual = "no_seleccionado"

  constructor(
    private form_builder: FormBuilder,
    private auth: AngularFireAuth,

    private router: Router,

    private http: HttpClient

  ){
    this.registrar_usuario = this.form_builder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repetir_password: ['', Validators.required],
      rol: ['no_seleccionado']
    })
  }


  ubicar_rol(rol_obtenido: string){
   this.rol_actual = rol_obtenido

   this.registrar_usuario.value.rol = this.rol_actual



   

  }

  registrar(){
    
    const contenido = "pizza"

    const email = this.registrar_usuario.value.email

    const password = this.registrar_usuario.value.password

    const repetir_password = this.registrar_usuario.value.repetir_password

    const nombre = this.registrar_usuario.value.nombre

    const rol = this.registrar_usuario.value.rol

    console.log(this.registrar_usuario)

    const informacion_usuarios = {'nombre': nombre, 'rol': rol}
 
    console.log(informacion_usuarios)

  if(password != repetir_password){
      Swal.fire({
        icon: 'error',
        title: 'Error al crear usuario',
        text: 'las contraseñas no son iguales, asegurese de escribirlas correctamente',
      })
    }


    else if(password.length < 6){
      
      Swal.fire({
        icon: 'error',
        title: 'Error al crear usuario',
        text: 'La contraseña es fácilmente vulnerable, escriba una contraseña más compleja de descifrar',
      })

    }

    else{

      this.mostrar_carga = true

      this.auth.createUserWithEmailAndPassword(email, password)
      .then(
        (respuesta)=>{

          this.auth.signInWithEmailAndPassword(email, password)
          .then(
            (respuesta)=>{
      
              
              respuesta.user?.sendEmailVerification()

              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Revisa tu correo para que puedas verificar tu cuenta',
                showConfirmButton: false,
                timer: 5000
              })

              this.router.navigate(['/login'])

              
                //obtenemos el token para acceder a la base de datos
                firebase.getAuth().currentUser?.getIdToken().then(
                (token_obtenido)=>{

                  //con esto creamos los privilegios de los usuarios
                  const id_usuario_creado = respuesta.user?.uid
              
                  this.http.post('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + id_usuario_creado + '.json?auth=' + token_obtenido, informacion_usuarios)
                  .subscribe()
    
                  
    
                  
    
                }
              )

          
      
            }
          )
          .catch(
            (error)=>{
              console.log(error.code)

            }
          )

          

        }

        
      )
      .catch(
        (error)=>{
          console.log("error capturado")
          console.log(error.code)

          
          if(error.code == "auth/email-already-in-use"){

            Swal.fire({
              icon: 'error',
              title: 'Error al crear usuario',
              text: 'El usuario que intenta crear ya existe',
            })

           

          }

          else if (error.code == "auth/invalid-email"){
            Swal.fire({
              icon: 'error',
              title: 'Error al crear usuario',
              text: 'El formato del correo es incorrecto, asegurese de escribir, "@", seguido del proveedor del servicio de correo que desee usar, junto con ".com"',
            })
          }

          this.mostrar_carga = false
          
        }

        
      )

     
      

   

    }





  }

  

}

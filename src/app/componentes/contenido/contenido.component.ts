import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GuardianService } from 'src/app/guardian.service';

import { HttpClient } from '@angular/common/http';
import { PizzasContenidoService } from './pizzas-contenido.service';
import { PizzaCreada } from './pizza-creada';


import Swal from 'sweetalert2'
import { PizzaCarritoCompras } from './pizza-carrito-compras';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.css']
})
export class ContenidoComponent {

  //esto es para usar el formulario
  @ViewChild('formulario') formulario: any;
  
  //este es para crear formulario
  @ViewChild('formulario_crear') formulario_crear: any;

  pizzas_menu_contenido: PizzaCreada[] = []


  //pizzas para carrito de compras
  lista_pizzas_carrito_compras: PizzaCarritoCompras[] = []

 //verificar si hay contenido en el array lista pizza carrito compras
 hay_contenido_carrito_compras = false
  

  //abrir menu barrita
  ver_menu_barrita = false

 

  constructor(

    private router: Router,
    private auth: AngularFireAuth,

    private guardian_service: GuardianService,

    private http: HttpClient,

    public pizzas_contenido: PizzasContenidoService
    
  ){

   this.pizzas_contenido.enviar_pizza_creads_en_local.subscribe(

    (pizzas_obtenidas)=>{

      this.pizzas_menu_contenido = pizzas_obtenidas

    }

   )


  }

  nombre_usuario =  ""
  rol_usuario = ""

  es_admin = false
  

  ngOnInit(): void {
   
    const user_id = localStorage.getItem('id_user')

    this.http.get('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + user_id +'.json').subscribe(
      (respuesta)=>{


        Object.values(respuesta).forEach(

          (elementos)=>{
            

            if(Array.isArray(elementos) == false){

              if(Object.values(elementos)[Object.keys(elementos).indexOf('rol')] == 'admin'){
                this.rol_usuario = 'admin'
              }
  
              else if (Object.values(elementos)[Object.keys(elementos).indexOf('rol')] == 'visitante'){
                this.rol_usuario = 'visitante'
              }
             
              const nombre_usuario_obtenido = String(Object.values(elementos)[Object.keys(elementos).indexOf('nombre')])  
             
              //damos el nombre al usuario
              this.nombre_usuario = nombre_usuario_obtenido
              
  
              //definimos si hay el permiso de admin
              if(this.rol_usuario == 'admin'){
                this.es_admin = true
              }
          
              else{
              this.es_admin = false
              }
              
            }
           

            

          
            
      
          }
        )

        

        }
      )

   
    this.pizzas_contenido.mostrar_pizzas().subscribe(

      (pizzas_obtenidas)=>{
        this.pizzas_menu_contenido = pizzas_obtenidas
        this.pizzas_contenido.pizzas_menu = pizzas_obtenidas

        //obtenemos las pizzas agregadas al carrito
        this.pizzas_contenido.mostrar_pizzas_carrito_compras().subscribe(

          (pizza_carrito)=>{
            this.lista_pizzas_carrito_compras = pizza_carrito

            if(this.lista_pizzas_carrito_compras != null){

              this.hay_contenido_carrito_compras = true  

              this.lista_pizzas_carrito_compras.forEach(
                (cada_pizza_carrito)=>{
                  //sumamos la cantidad de veces pedida la pizza para sacar el total
                  this.pizzas_contenido.cantidad_pizzas_carrito += Number(cada_pizza_carrito.cantidad_pizzas_compradas)

                  //obtenemos el precio total a pagar pizzas carrito
                  this.pizzas_contenido.total_pagar_carrito += Number(cada_pizza_carrito.precio) * Number(cada_pizza_carrito.cantidad_pizzas_compradas) 
                }
              )

            }

           


          }

        )

      }
    )     
    
    
  }
  
  cerrar_sesion(){

    this.auth.signOut()
    .then(
      ()=>{
        this.router.navigate(['/login'])
        localStorage.removeItem('user_token')

        localStorage.removeItem('id_user')

        this.pizzas_contenido.cantidad_pizzas_carrito = 0


      }
    )
    .catch(
      error => (console.log(error))
    )

  }

  boton_crear_pizza(){
    this.pizzas_contenido.permitir_crear_pizza = true

    this.formulario_crear.ngOnInit()
  }

  cerrar_crear_pizza(){
    this.formulario_crear.ngOnDestroy()
  }

  enviar_indice_editar(indice: number){

    this.pizzas_contenido.indice_para_editar = String(indice)

    this.pizzas_contenido.indice_para_editar_numero = indice

    this.pizzas_contenido.abrir_editar = true

    this.formulario.ngOnInit()
 
  }

  cerrar_editar(){
    this.pizzas_contenido.abrir_editar = false

    this.formulario.ngOnDestroy()
  }

  eliminar_una_pizza(indice_obtenido: number){

    Swal.fire({
      title: 'Quieres eliminar la pizza?',
      text: "Se eliminará completamente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.pizzas_menu_contenido.splice(indice_obtenido, 1)

        this.pizzas_contenido.eliminar_pizza(this.pizzas_menu_contenido)

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha eliminado una pizza del menú',
          showConfirmButton: false,
          timer: 4000
        })

      }
    })

  }

  boton_eliminar_todas_pizzas(){

    Swal.fire({
      title: 'Quieres eliminar todas las pizzas?',
      text: "Se eliminarán completamente todas las pizzas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.pizzas_contenido.eliminar_todas_pizzas()

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se han eliminado todas las pizza del menú',
          showConfirmButton: false,
          timer: 4000
        })
      }
    })

    
  }

  //comprar pizza
  comprar_pizza(indice_obtenido: number){
    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Has comprado una ' + this.pizzas_menu_contenido[indice_obtenido].nombre_pizza,
      showConfirmButton: false,
      timer: 4000
    })

  }

  agregar_al_carrito(indice_obtenido: number){

    if(this.lista_pizzas_carrito_compras == null){
      this.lista_pizzas_carrito_compras = []
    }

    const nombre_pizza = this.pizzas_menu_contenido[indice_obtenido].nombre_pizza

    const precio = this.pizzas_menu_contenido[indice_obtenido].precio

    const imagen_pizza_carrito = this.pizzas_menu_contenido[indice_obtenido].imagen_pizza

    const cantidad_pizzas_compradas = 1

    const pizza_para_carrito = new PizzaCarritoCompras( nombre_pizza, precio, imagen_pizza_carrito , cantidad_pizzas_compradas)

    let indice_de_pizza_carrito: null | number = null 

   this.lista_pizzas_carrito_compras.forEach(

    (pizza_carrito, index)=>{

      if(pizza_carrito.nombre_pizza == nombre_pizza && pizza_carrito.precio == precio){

         indice_de_pizza_carrito = index

      }

      
    }

   )
   

   //para agregar al menú
   if(indice_de_pizza_carrito == null){

      
    this.lista_pizzas_carrito_compras.push(pizza_para_carrito)

    this.pizzas_contenido.agregar_al_carrito_compras(this.lista_pizzas_carrito_compras)

    //aumentamos el númeero de pizzas carrito
    this.pizzas_contenido.cantidad_pizzas_carrito += 1

    //aumentamos la cantidad a pagar pizza
    this.pizzas_contenido.total_pagar_carrito += Number(this.pizzas_menu_contenido[indice_obtenido].precio)

   }

   else if (indice_de_pizza_carrito != null){

    const nombre_pizza_actualizada = this.lista_pizzas_carrito_compras[indice_de_pizza_carrito].nombre_pizza
    
    const precio_pizza_actualizada = this.lista_pizzas_carrito_compras[indice_de_pizza_carrito].precio

    const imagen_actualizada_carrito = this.lista_pizzas_carrito_compras[indice_de_pizza_carrito].imagen_pizza

    const pizza_cantidad_agregada = this.lista_pizzas_carrito_compras[indice_de_pizza_carrito].cantidad_pizzas_compradas += 1
    
    const pizza_actualizada_carrito = new PizzaCarritoCompras (nombre_pizza_actualizada, precio_pizza_actualizada,imagen_actualizada_carrito , pizza_cantidad_agregada) 
    
    this.lista_pizzas_carrito_compras.splice(indice_de_pizza_carrito, 1, pizza_actualizada_carrito)
   
    this.pizzas_contenido.agregar_al_carrito_compras(this.lista_pizzas_carrito_compras)

    this.pizzas_contenido.cantidad_pizzas_carrito += 1


    //aumentamos la cantidad a pagar pizza en total
    this.pizzas_contenido.total_pagar_carrito += Number(this.pizzas_menu_contenido[indice_obtenido].precio)


   }


   

    this.hay_contenido_carrito_compras = true

     
    

  }

  abrir_carrito(){
  
    this.ver_menu_barrita = true
  

  }

  cerrar_carrito(){
    this.ver_menu_barrita = false
  }

  
  eliminar_una_pizza_del_carrito(indice_obtenido_de_pizza_carrito: number){

    //cuando la pizza a eliminar no es repetida
    if(this.lista_pizzas_carrito_compras[indice_obtenido_de_pizza_carrito].cantidad_pizzas_compradas == 1){
      
      this.lista_pizzas_carrito_compras.splice(indice_obtenido_de_pizza_carrito, 1 )

      this.pizzas_contenido.eliminar_una_pizza_carrito(this.lista_pizzas_carrito_compras)

      //decimos que los valores de cantidad pizza carrito y total a pagar es cero para poder dar
      //su verdadero valor al sumar
      this.pizzas_contenido.cantidad_pizzas_carrito = 0

      this.pizzas_contenido.total_pagar_carrito = 0

      this.lista_pizzas_carrito_compras.forEach(
        (cada_pizza_carrito)=>{
          //sumamos la cantidad de veces pedida la pizza para sacar el total
          this.pizzas_contenido.cantidad_pizzas_carrito += Number(cada_pizza_carrito.cantidad_pizzas_compradas)

          //obtenemos el precio total a pagar pizzas carrito
          this.pizzas_contenido.total_pagar_carrito += Number(cada_pizza_carrito.precio) * Number(cada_pizza_carrito.cantidad_pizzas_compradas) 
        }
      )

      
        
      
    }

    //cuando la pizza a eliminar es repetida
    else if(this.lista_pizzas_carrito_compras[indice_obtenido_de_pizza_carrito].cantidad_pizzas_compradas > 1){

      
      const nombre_pizza_eliminada_actualizar = this.lista_pizzas_carrito_compras[indice_obtenido_de_pizza_carrito].nombre_pizza

      const precio_pizza_eliminar_actualizar = this.lista_pizzas_carrito_compras[indice_obtenido_de_pizza_carrito].precio

      const imagen_pizza_carrito_eliminar_actualizar = this.lista_pizzas_carrito_compras[indice_obtenido_de_pizza_carrito].imagen_pizza

      //eliminamos una cantidad de pizza agregada
      const cantidad_pizzas_compradas_eliminar_actualizar = this.lista_pizzas_carrito_compras[indice_obtenido_de_pizza_carrito].cantidad_pizzas_compradas -= 1

      const pizza_para_carrito_eliminar_actualizar = new PizzaCarritoCompras( 
        nombre_pizza_eliminada_actualizar, precio_pizza_eliminar_actualizar, imagen_pizza_carrito_eliminar_actualizar , cantidad_pizzas_compradas_eliminar_actualizar
        
      )

      this.lista_pizzas_carrito_compras.splice(indice_obtenido_de_pizza_carrito, 1, pizza_para_carrito_eliminar_actualizar)

      this.pizzas_contenido.eliminar_una_pizza_carrito(this.lista_pizzas_carrito_compras)

      //decimos que los valores de cantidad pizza carrito y total a pagar es cero para poder dar
      //su verdadero valor al sumar
      this.pizzas_contenido.cantidad_pizzas_carrito = 0

      this.pizzas_contenido.total_pagar_carrito = 0


      this.lista_pizzas_carrito_compras.forEach(
        (cada_pizza_carrito)=>{
          //sumamos la cantidad de veces pedida la pizza para sacar el total
          this.pizzas_contenido.cantidad_pizzas_carrito += Number(cada_pizza_carrito.cantidad_pizzas_compradas)

          //obtenemos el precio total a pagar pizzas carrito
          this.pizzas_contenido.total_pagar_carrito += Number(cada_pizza_carrito.precio) * Number(cada_pizza_carrito.cantidad_pizzas_compradas) 
        }
      )




      

    }


    //verificamos si hay contenido en el carrito de compras
    if(this.lista_pizzas_carrito_compras.length == 0){
      this.hay_contenido_carrito_compras = false
    }


  }

  eliminar_toda_pizza_carrito(){
    
    Swal.fire({
      title: 'Quieres eliminar todo el contenido de tu carrito?',
      text: "Se eliminará todo el contenido de tu carrito",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
       

        this.pizzas_contenido.eliminar_todas_las_pizzas_carrito()

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Has eliminado todas las pizzas de tu carrito',
          showConfirmButton: false,
          timer: 4000
        })

        this.lista_pizzas_carrito_compras = []

        //decimos que los valores de cantidad pizza carrito y total a pagar es cero para poder dar
        //su verdadero valor al sumar
        this.pizzas_contenido.cantidad_pizzas_carrito = 0

        this.pizzas_contenido.total_pagar_carrito = 0


        this.lista_pizzas_carrito_compras.forEach(
          (cada_pizza_carrito)=>{
            //sumamos la cantidad de veces pedida la pizza para sacar el total
            this.pizzas_contenido.cantidad_pizzas_carrito += Number(cada_pizza_carrito.cantidad_pizzas_compradas)

            //obtenemos el precio total a pagar pizzas carrito
            this.pizzas_contenido.total_pagar_carrito += Number(cada_pizza_carrito.precio) * Number(cada_pizza_carrito.cantidad_pizzas_compradas) 
          }
        )

        this.hay_contenido_carrito_compras = false


      }
    })
  }

  comprar_todas_pizzas_carrito(){
    
    Swal.fire({
      title: 'Quieres comprar todas las pizzas de tu carrito?',
      text: "Vas a comprar todo el contenido de tu carrito",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Comprar'
    }).then((result) => {
      if (result.isConfirmed) {
       

        this.pizzas_contenido.eliminar_todas_las_pizzas_carrito()

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Has comprado todas las pizzas de tu carrito',
          showConfirmButton: false,
          timer: 4000
        })

        this.lista_pizzas_carrito_compras = []

        //decimos que los valores de cantidad pizza carrito y total a pagar es cero para poder dar
        //su verdadero valor al sumar
        this.pizzas_contenido.cantidad_pizzas_carrito = 0

        this.pizzas_contenido.total_pagar_carrito = 0


        this.lista_pizzas_carrito_compras.forEach(
          (cada_pizza_carrito)=>{
            //sumamos la cantidad de veces pedida la pizza para sacar el total
            this.pizzas_contenido.cantidad_pizzas_carrito += Number(cada_pizza_carrito.cantidad_pizzas_compradas)

            //obtenemos el precio total a pagar pizzas carrito
            this.pizzas_contenido.total_pagar_carrito += Number(cada_pizza_carrito.precio) * Number(cada_pizza_carrito.cantidad_pizzas_compradas) 
          }
        )

        this.hay_contenido_carrito_compras = false


      }
    })
  }

  

}

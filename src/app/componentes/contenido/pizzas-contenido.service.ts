import { EventEmitter, Injectable, OnInit } from '@angular/core';

//importamos HttpClient
import { HttpClient } from '@angular/common/http';
import { PizzaCreada } from './pizza-creada';
import { PizzaCarritoCompras } from './pizza-carrito-compras';

@Injectable({
  providedIn: 'root'
})
export class PizzasContenidoService{

  pizzas_menu: PizzaCreada[] = []

  indice_para_editar  = "" 

  indice_para_editar_numero: number | null = null

  //esto es cuando se está creando una pizza
  permitir_crear_pizza = false

  //esto es para permitir que se abra el modal
  abrir_editar = false


  //para actualizar la imagen de la pizza
  actualizar_imagen_pizza = ""

  //esto es para hacer la imagen de carga de subir la imagen
  esperar_a_subir_imagen = false


  //esto es para contar la cantidad de elementos para mostrar el número en carrito  
  cantidad_pizzas_carrito = 0

  //total a pagar carrito compras
  total_pagar_carrito = 0

  constructor(

    private http: HttpClient

  ) { 

    

  }

  enviar_pizza_creads_en_local = new EventEmitter()

  crear_pizza(pizza_obtenida: PizzaCreada){

   //esto es porque cuando no hay contenido en el array pizza_menu se coloca como null 
   if(this.pizzas_menu == null){
    this.pizzas_menu = []
   }

   
   this.pizzas_menu.push(pizza_obtenida) 

    const token_usuario = localStorage.getItem('user_token')
   
    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json?auth=' + token_usuario , this.pizzas_menu)
    .subscribe()

    this.enviar_pizza_creads_en_local.emit(this.pizzas_menu)

  }

  mostrar_pizzas(){
    
    const token_usuario = localStorage.getItem('user_token')
    return this.http.get<PizzaCreada[]>('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json?auth=' + token_usuario)
  }

  editar_pizza(indice_obtenido: string, pizza_obtenida: PizzaCreada){

    const token_usuario = localStorage.getItem('user_token')
    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos' + '/' + indice_obtenido + '.json?auth=' + token_usuario, pizza_obtenida)
    .subscribe(
      ()=>{

        this.mostrar_pizzas().subscribe(
          (pizzas_obtenidas)=>{
            this.pizzas_menu = pizzas_obtenidas
    
            this.enviar_pizza_creads_en_local.emit(this.pizzas_menu)
          }
        )

      }
    )

    

  }


  eliminar_pizza(pizza_obtenidas: PizzaCreada[]){

    const token_usuario = localStorage.getItem('user_token')
    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json?auth=' + token_usuario , pizza_obtenidas)
    .subscribe(
      ()=>{

       
        
        this.mostrar_pizzas().subscribe(
          (pizzas_obtenidas)=>{
    
            this.pizzas_menu = pizzas_obtenidas

            if(this.pizzas_menu != null){

              this.enviar_pizza_creads_en_local.emit(this.pizzas_menu)
               
          }

          else if(this.pizzas_menu == null){
            this.enviar_pizza_creads_en_local.emit(null)
          }
            





          }
        )

      }
    )

  }

  eliminar_todas_pizzas(){

    const token_usuario = localStorage.getItem('user_token')
    this.http.delete('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json?auth=' + token_usuario).subscribe(
      ()=>{

        this.mostrar_pizzas().subscribe(

          (pizzas_obtenidas)=>{
            this.pizzas_menu = pizzas_obtenidas

            this.enviar_pizza_creads_en_local.emit(this.pizzas_menu)

          }

        )

      }
    )
  }

  agregar_al_carrito_compras(pizzas_carrito_compras_obtenido: PizzaCarritoCompras[]){

    const token_usuario = localStorage.getItem('user_token')
    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json?auth=' + token_usuario, pizzas_carrito_compras_obtenido).subscribe()

  }

  mostrar_pizzas_carrito_compras(){

    const token_usuario = localStorage.getItem('user_token')
    return this.http.get<PizzaCarritoCompras[]>('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json?auth=' + token_usuario)
  }

  eliminar_una_pizza_carrito(pizzas_carrito_obtenido: PizzaCarritoCompras[]){

    const token_usuario = localStorage.getItem('user_token')
    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json?auth=' + token_usuario, pizzas_carrito_obtenido).subscribe()

  }

  eliminar_todas_las_pizzas_carrito(){

    const token_usuario = localStorage.getItem('user_token')
    this.http.delete('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json?auth=' + token_usuario).subscribe()
  }
  

}

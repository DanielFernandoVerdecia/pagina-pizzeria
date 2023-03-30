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

  
   
    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json', this.pizzas_menu)
    .subscribe()

    this.enviar_pizza_creads_en_local.emit(this.pizzas_menu)

  }

  mostrar_pizzas(){
    return this.http.get<PizzaCreada[]>('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json')
  }

  editar_pizza(indice_obtenido: string, pizza_obtenida: PizzaCreada){

    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos' + '/' + indice_obtenido + '.json', pizza_obtenida)
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

    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json', pizza_obtenidas)
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
    this.http.delete('https://login-angular-53533-default-rtdb.firebaseio.com/pizzas_datos.json').subscribe(
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

    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json', pizzas_carrito_compras_obtenido).subscribe()

  }

  mostrar_pizzas_carrito_compras(){
    return this.http.get<PizzaCarritoCompras[]>('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json')
  }

  eliminar_una_pizza_carrito(pizzas_carrito_obtenido: PizzaCarritoCompras[]){

    this.http.put('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json', pizzas_carrito_obtenido).subscribe()

  }

  eliminar_todas_las_pizzas_carrito(){
    this.http.delete('https://login-angular-53533-default-rtdb.firebaseio.com/datos/' + localStorage.getItem('id_user') + '/carrito_compras.json').subscribe()
  }
  

}

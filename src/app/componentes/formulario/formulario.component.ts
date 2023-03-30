import { Component } from '@angular/core';

//esto es para poder subir las imagenes
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//esto es para cuando se haya subido la imagen a firebase storage
import { finalize } from 'rxjs/operators';
import { PizzaCreada } from '../contenido/pizza-creada';
import { PizzasContenidoService } from '../contenido/pizzas-contenido.service';

//importamos sweet alert
import Swal from 'sweetalert2'


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  esperar_subir_imagen = false

  pizzas: PizzaCreada[] = [] 
  
  //campos del formulario
  nombre_pizza = ""
  descripcion_pizza = ""
  precio: number | null = null
  imagen_visualizar = ""


  constructor(
    private angular_fire_storage: AngularFireStorage,
    
    public pizzas_contenido: PizzasContenidoService
  ){

    

  }

  ngOnInit(): void {
    
    if(this.pizzas_contenido.abrir_editar){
      

      this.pizzas_contenido.mostrar_pizzas().subscribe(

        (pizzas_obtenidas)=>{

          this.pizzas = pizzas_obtenidas


          const nombre_pizza = this.pizzas[Number(this.pizzas_contenido.indice_para_editar)].nombre_pizza

          const descripcion_pizza = this.pizzas[Number(this.pizzas_contenido.indice_para_editar)].descripcion_pizza

          const precio = this.pizzas[Number(this.pizzas_contenido.indice_para_editar)].precio

          const imagen_pizza = this.pizzas[Number(this.pizzas_contenido.indice_para_editar)].imagen_pizza


          this.nombre_pizza = nombre_pizza
          this.descripcion_pizza = descripcion_pizza
          this.precio = precio
          this.pizzas_contenido.actualizar_imagen_pizza = imagen_pizza


        }

      )

    }

    else if (this.pizzas_contenido.permitir_crear_pizza){

      this.nombre_pizza = ""
      this.descripcion_pizza = ""
      this.precio = null
      this.imagen_visualizar = ""
  
    }
    
  }

  //cuando se cierra el formulario
  ngOnDestroy(): void {

    this.pizzas_contenido.abrir_editar = false

    this.pizzas_contenido.permitir_crear_pizza = false


  }
  

  subir_imagen(imagen_recibida: any){

  

   const path_imagen = "pizzas/" + imagen_recibida.target.files[0].name

   //subimos la imagen a firebase storage
   const subir_imagen = this.angular_fire_storage.upload(path_imagen, imagen_recibida.target.files[0])

   //obtener el link de descarga
   const link_descarga =  this.angular_fire_storage.ref(path_imagen).getDownloadURL()

   //se inicia la animación de de esperar subir imagen
   this.esperar_subir_imagen = true

   this.pizzas_contenido.esperar_a_subir_imagen = true


   //hacemos que el anterior visualizacion de pizza se quite
   this.imagen_visualizar = ""

   //obtenemos la dirección de la imagen que subimos
   subir_imagen.snapshotChanges().pipe(

    //finalize sirve para cuando se haya finalizado un proceso suceda algo
    finalize(() => {

      link_descarga.subscribe(

        (url_obtenida)=>{

          //se termina la animación de esperar subir imagen
          this.esperar_subir_imagen = false

          this.pizzas_contenido.esperar_a_subir_imagen = false

          this.imagen_visualizar = url_obtenida
          

          //para actualizar
          this.pizzas_contenido.actualizar_imagen_pizza = url_obtenida
      
        }

      )
    })

   ).subscribe()
   

    

  }


  


  agregar_pizza(){

   
    
    
    //para editar
    if(this.pizzas_contenido.abrir_editar){
      

      const pizza_editada = new PizzaCreada(
        this.nombre_pizza, this.descripcion_pizza, this.precio, this.pizzas_contenido.actualizar_imagen_pizza
      )

      this.pizzas_contenido.editar_pizza(this.pizzas_contenido.indice_para_editar, pizza_editada)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se ha actualizado al menú ' + "''" + this.nombre_pizza + "''" + "con éxito",
        showConfirmButton: false,
        timer: 5000
      })

      this.pizzas_contenido.actualizar_imagen_pizza = ""

      this.pizzas_contenido.abrir_editar = false

    }
  
   //para guardar al crear   
   else{

    const imagen_pizza = this.imagen_visualizar

  
    const pizza_para_guardar = new PizzaCreada(
      this.nombre_pizza, this.descripcion_pizza, this.precio, imagen_pizza
    )



    //creamos la pizza
    this.pizzas_contenido.crear_pizza(pizza_para_guardar)


    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Se ha agregado al menú ' + "''" + this.nombre_pizza + "''" + "con éxito",
      showConfirmButton: false,
      timer: 5000
    })


    this.nombre_pizza = ""
    this.descripcion_pizza = ""
    this.precio = null
    this.imagen_visualizar = ""


   

   } 
  
   
    
    

    

  }

}

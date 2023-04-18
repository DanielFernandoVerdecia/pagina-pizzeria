import { EventEmitter, Injectable } from '@angular/core';
import { PizzaSugerencia } from './pizza-sugerencia';

@Injectable({
  providedIn: 'root'
})
export class PizzaEncontradaBuscadorService {

  constructor() { }

  pizzas_del_buscador: PizzaSugerencia[] = []

 
  


}

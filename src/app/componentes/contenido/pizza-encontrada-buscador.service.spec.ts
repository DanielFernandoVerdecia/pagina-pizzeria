import { TestBed } from '@angular/core/testing';

import { PizzaEncontradaBuscadorService } from './pizza-encontrada-buscador.service';

describe('PizzaEncontradaBuscadorService', () => {
  let service: PizzaEncontradaBuscadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PizzaEncontradaBuscadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

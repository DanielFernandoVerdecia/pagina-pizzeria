import { TestBed } from '@angular/core/testing';

import { PizzasContenidoService } from './pizzas-contenido.service';

describe('PizzasContenidoService', () => {
  let service: PizzasContenidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PizzasContenidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerDemandeComponent } from './creer-demande.component.js';

describe('CreerDemande', () => {
  let component: CreerDemandeComponent;
  let fixture: ComponentFixture<CreerDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

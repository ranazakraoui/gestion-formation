import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: any[] = [];
  
  add(modal: any): void {
    this.modals.push(modal);
  }

  remove(id: string): void {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string): void {
    const modal = this.modals.find(x => x.id === id);
    if (modal) {
      modal.open();
    }
  }

  close(id: string): void {
    const modal = this.modals.find(x => x.id === id);
    if (modal) {
      modal.close();
    }
  }
}
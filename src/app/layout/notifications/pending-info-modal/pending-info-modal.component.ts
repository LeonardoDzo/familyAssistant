import { Pending } from './../../../shared/models/pending';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pending-info-modal',
  templateUrl: './pending-info-modal.component.html',
  styleUrls: ['./pending-info-modal.component.scss']
})
export class PendingInfoModalComponent implements OnInit {
  @Input()
  pending: Pending;
  types = ['eventos','objetivo','galeria','caja fuerte','contactos','botiquin','inmuebles','salud','seguros','presupuesto','lista de tareas','fax']  
  priorities = ['Nada urgente', 'Poco urgente', 'Muy urgente']
  constructor() { }

  ngOnInit() {
  }
  
}

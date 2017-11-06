import { Contacto } from './../../services/contacto';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  @Input() contacto: Contacto;
  
  constructor() { }

  ngOnInit() {
  }

}

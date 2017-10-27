import { UserService } from 'app/shared/services/user.service';
import { Contacto } from './../../services/contacto';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {
  public contacto = new Contacto();
  public errorMessage: string[] = [];
  constructor(private modalService: BsModalService,private userService: UserService) { }

  ngOnInit() {
  }

  private validateForm(): boolean {
    let result = true;

    if(!this.contacto.nombre) {
      this.errorMessage.push('El campo nombre es obligatorio.')
    } 

    if(!this.contacto.telefono) {
      this.errorMessage.push('El campo teléfono es obligatorio.')
    } 

    if(!this.contacto.ocupacion) {
      this.errorMessage.push('El campo ocupación es obligatorio.')
    }

    return result;
  }

  public addContact() {
    if(this.validateForm())
      this.userService.addContact(this.contacto);
  }
}

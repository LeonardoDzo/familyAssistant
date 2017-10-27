import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from './../../shared/services/user.service';
import { Contacto } from './../../shared/services/contacto';
import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
  animations: [routerTransition()]
})
export class ContactosComponent implements OnInit {
  public modalRef: BsModalRef;
  public errorMessage: string[] = [];
  public contacto = new Contacto();
  public contacts: Contacto[] = [];

  constructor(
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private modalService: BsModalService,
    private userService: UserService,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
     this.userService.getContacts().subscribe((contacts: Contacto[]) => {
      this.contacts = contacts;
     });
  }

  public removeContact() {
    this.userService.removeContact(this.contacto,this.toastr);
    this.modalRef.hide();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  public openInfoModal(contact: Contacto, template: TemplateRef<any>) {
    this.contacto = contact;
    this.openModal(template);
  }

  public openConfirmModal(contact: Contacto,template: TemplateRef<any>) {
    this.contacto = contact;
    this.openModal(template);
  }

  public newContact(template: TemplateRef<any>) {
    this.contacto = new Contacto();
    this.openModal(template);
  }

  public edit(contact: Contacto,template: TemplateRef<any>) {
    this.contacto = contact;
    this.openModal(template);
  }

  private validateForm(): boolean {
    let result = true;

    if(!this.contacto.nombre) {
      this.errorMessage.push('El campo nombre es obligatorio.')
      result = false;
    } 

    if(!this.contacto.telefono) {
      this.errorMessage.push('El campo teléfono es obligatorio.')
      result = false;
    } 

    if(!this.contacto.ocupacion) {
      this.errorMessage.push('El campo ocupación es obligatorio.')
      result = false;
    }

    return result;
  }

  public addContact() {
    this.userService.addContact(this.contacto,this.toastr);
    this.errorMessage = [];
  }

  public updateContact() {
    this.userService.updateContact(this.contacto,this.toastr);
    this.errorMessage = [];
  }

  public submitModal() {
    if(this.validateForm()){
      if(!this.contacto.key)
        this.addContact();
      else 
        this.updateContact();
      this.modalRef.hide();
    }
  }
}

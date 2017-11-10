import { RegexService } from './../../shared/services/regex.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from './../../shared/services/user.service';
import { Contacto } from './../../shared/services/contacto';
import { Component, OnInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { TabsetComponent } from 'ngx-bootstrap';

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
  public realContacts: Contacto[] = [];
  public contacts: Contacto[] = [];
  public currentPage = 1;
  public totalItems = 0;
  public itemsPerPage = 10;

  constructor(
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private modalService: BsModalService,
    private userService: UserService,
    private regexService: RegexService,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
     this.userService.getContacts().subscribe((contacts: Contacto[]) => {
      contacts.sort((a,b) => {
        if(a.nombre < b.nombre){
          return -1;
        } else if(a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });

      this.realContacts = contacts;
      this.totalItems = contacts.length;
      this.contacts = this.realContacts.slice(0,this.itemsPerPage);
     });
  }

  search($event) {
    this.contacts = this.realContacts.filter( item => {
      return item.nombre.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1;
    });
    this.currentPage = 1;
    this.totalItems = this.contacts.length;
    this.contacts = this.contacts.slice(0,this.itemsPerPage);
  }

  public removeContact() {
    this.userService.removeContact(this.contacto,this.toastr);
    this.modalRef.hide();
  }

  public openModal(template: TemplateRef<any>,contact: Contacto = new Contacto()) {
    this.contacto = Object.assign(new Contacto(), contact);
    this.modalRef = this.modalService.show(template);
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
    this.errorMessage = this.regexService.contactValidation(this.contacto);
    if(this.errorMessage.length < 1) {
      if(!this.contacto.key)
        this.addContact();
      else 
        this.updateContact();
      this.modalRef.hide();
    }
  }

  public pageChanged($event: any) {
    this.currentPage = $event.page;
    this.contacts = this.realContacts.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);
  }
}

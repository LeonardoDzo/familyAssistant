import { CrudService } from './../../shared/services/crud.service';
import { User } from 'app/shared/models/user';
import { RegexService } from './../../shared/services/regex.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Contacto } from './../../shared/models/contacto';
import { Component, OnInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { TabsetComponent } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';

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
  public sub: Subscription;
  folderName: string
  userSub: Subscription;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  constructor(
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private modalService: BsModalService,
    private regexService: RegexService,
    private crudService: CrudService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.crudService.setTable("contacts");
  }

  private init(user: User) {
    if(this.sub){
      this.sub.unsubscribe();
    }
    this.sub = this.crudService.getObjects(user).subscribe((snapshots) => {
      let contacts: Contacto[] = []

      snapshots.forEach(elem => {
        let contact = Object.assign(new Contacto(), elem.payload.toJSON())
        contact.id = elem.key;
        contacts.push(contact)
      })

      contacts.sort((a,b) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()){
          return -1;
        } else if(a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });

      this.realContacts = contacts;
      this.totalItems = contacts.length;
      this.contacts = this.realContacts.slice(0,this.itemsPerPage);
     }, error => {
       
     });
  }

  ngOnInit() {
    this.userSub = this.crudService.getUser().subscribe((user: User) => {
      this.init(user);
    }, error => {

    });
  }
  
  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
    this.userSub.unsubscribe();
    this.crudService.destroy();
  }

  search($event) {
    this.contacts = this.realContacts.filter( item => {
      return item.name.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1;
    });
    this.currentPage = 1;
    this.totalItems = this.contacts.length;
    this.contacts = this.contacts.slice(0,this.itemsPerPage);
  }

  public removeContact() {
    this.crudService.removeObject(this.contacto);
    this.currentPage = 1;
    this.contacts = this.realContacts.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);    
    this.modalRef.hide();
  }

  public openModal(template: TemplateRef<any>,contact: Contacto = new Contacto(),clase: string = '') {
    if(this.modalRef){
      this.modalRef.hide();
    }
    this.contacto = Object.assign(new Contacto(), contact);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: clase })
    );
  }

  public addContact() {
    this.crudService.addObject(this.contacto);
    this.errorMessage = [];
  }

  public updateContact() {
    this.crudService.editObject(this.contacto);
    this.errorMessage = [];
  }
  
  public submitModal() {
    this.errorMessage = this.regexService.contactValidation(this.contacto);
    if(this.errorMessage.length < 1) {
      if(!this.contacto.id)
        this.addContact();
      else 
        this.updateContact();
      this.modalRef.hide();
    }
  }

  public pageChanged($event: any) {
    this.currentPage = $event.page;
    this.contacts = this.realContacts.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);
    window.scrollTo(0, 0);
  }
}

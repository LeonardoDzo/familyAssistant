import { CrudService } from './../../../shared/services/crud.service';
import { Contacto } from './../../../shared/models/contacto';
import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-contact-modal',
  templateUrl: './new-contact-modal.component.html',
  styleUrls: ['./new-contact-modal.component.scss']
})
export class NewContactModalComponent implements OnInit {
  @Input()
  contacto: Contacto
  @Input()
  public modalRef: BsModalRef;
  form: FormGroup = this.formBuilder.group({
    name: ["",[Validators.required]],
    phone: ["",[Validators.required,Validators.pattern(/^(\d{7,10})$/)]],
    job: ["",[Validators.required]],
    email: ["",[Validators.required,Validators.email]],
    address: ["",[]],
    webpage: ["",[]]
  });
  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() { }

  public submitModal() {
    if(!this.form.controls.email.hasError("email") && !this.form.controls.phone.hasError("pattern")){
      if(!this.contacto.id)
        this.crudService.addObject(this.contacto);
      else 
        this.crudService.editObject(this.contacto);
      this.modalRef.hide();
    }
  }

}

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CrudService } from './../../../shared/services/crud.service';
import { Component, OnInit , Input} from '@angular/core';
import { Illness } from './../../../shared/models/illness';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-new-illness-modal',
  templateUrl: './new-illness-modal.component.html',
  styleUrls: ['./new-illness-modal.component.scss']
})
export class NewIllnessModalComponent implements OnInit {
  @Input()
  illness: Illness;
  @Input()
  modalRef: BsModalRef
  focused: string = ""
  separatorKeysCodes = [ENTER, 188];
  form: FormGroup = this.formBuilder.group({
    name: ["",[Validators.required]],
    dosage: ["",[Validators.required]],
    medicine: ["",Validators.required],
    type: ["",Validators.required]
  });
  medicines = [];
  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder
  ) { 
    this.crudService.setTable("illnesses")
  }

  ngOnInit() {
    if(this.illness.id) {
      let medicines = this.illness.medicine.split(",");
      medicines.forEach((med) => {
        this.medicines.push(med)
      })
    }
  }

  remove(fruit: any): void {
    let index = this.medicines.indexOf(fruit);

    if (index >= 0) {
      this.medicines.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.medicines.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  ngOnDestroy() {
    this.crudService.destroy();
  }

  onFocus() {
    this.focused = "focus";
  }

  onBlur() {
    this.focused = "";
  }

  public submitModal() {
    this.illness.medicine = this.medicines.join(",")
    if(!this.illness.id)
      this.crudService.addObject(this.illness)
    else
      this.crudService.editObject(this.illness)
    this.modalRef.hide()
  }
}

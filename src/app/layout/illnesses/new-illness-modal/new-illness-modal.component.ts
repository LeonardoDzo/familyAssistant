import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CrudService } from './../../../shared/services/crud.service';
import { Component, OnInit , Input} from '@angular/core';
import { Illness } from './../../../shared/models/illness';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
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

  form: FormGroup = this.formBuilder.group({
    name: ["",[Validators.required]],
    dosage: ["",[Validators.required]],
    moreInfo: ["",[Validators.required]],
    medicine: ["",Validators.required],
    type: ["",Validators.required]
  });
  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }

  public submitModal() {
    if(!this.illness.id)
      this.crudService.addObject(this.illness)
    else
      this.crudService.editObject(this.illness)
    this.modalRef.hide()
  }

}

import { CrudService } from './../../../shared/services/crud.service';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap';
import { Illness } from './../../../shared/models/illness';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-illness-info-modal',
  templateUrl: './illness-info-modal.component.html',
  styleUrls: ['./illness-info-modal.component.scss']
})
export class IllnessInfoModalComponent implements OnInit {
  @Input()
  illness: Illness
  @Input()
  public modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private crudService: CrudService
  ) { 
    this.crudService.setTable("illnesses")
  }

  ngOnInit() {
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    if(this.modalRef){
      this.modalRef.hide()
    }
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
  }

  public removeIllness() {
    this.crudService.removeObject(this.illness)
    this.modalRef.hide()
  }
}

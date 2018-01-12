import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap';
import { Illness } from './../../../shared/models/illness';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-illnesses-table',
  templateUrl: './illnesses-table.component.html',
  styleUrls: ['./illnesses-table.component.scss']
})
export class IllnessesTableComponent implements OnInit {
  @Input()
  illnesses: Illness[]
  @Input()
  title: string
  public modalRef: BsModalRef;
  illness: Illness
  constructor(
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    if(this.modalRef){
      this.modalRef.hide()
    }
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
  }

}

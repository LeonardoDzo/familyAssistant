import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap';
import { Illness } from './../../../shared/models/illness';
import { Component, OnInit, Input, TemplateRef, IterableDiffers, DoCheck } from '@angular/core';

@Component({
  selector: 'app-illnesses-table',
  templateUrl: './illnesses-table.component.html',
  styleUrls: ['./illnesses-table.component.scss']
})
export class IllnessesTableComponent implements OnInit,DoCheck {
  @Input()
  illnesses: Illness[] = []
  @Input()
  title: string
  displayIllnesses: Illness[] = []
  public modalRef: BsModalRef;
  pageSize = 10
  page = 0
  length = 0
  illness: Illness
  differ: any
  constructor(
    private modalService: BsModalService,
    private differs: IterableDiffers
  ) { 
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {}

  ngDoCheck() {
    const change = this.differ.diff(this.illnesses);
    if(change) {
      this.length = this.illnesses.length
      this.displayIllnesses = this.illnesses.slice(this.page*this.pageSize,(this.page+1)*this.pageSize)
    }
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    if(this.modalRef){
      this.modalRef.hide();
    }
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
  }

  change($event) {
    this.page = $event.pageIndex
    this.pageSize = $event.pageSize
    this.displayIllnesses = this.illnesses.slice(this.page*this.pageSize,(this.page+1)*this.pageSize)    
    window.scrollTo(0,0)
  }

}

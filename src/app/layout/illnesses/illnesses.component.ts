import { RegexService } from './../../shared/services/regex.service';
import { IllnessService } from './../../shared/services/illness.service';
import { Illness } from './../../shared/services/illness';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'app-illnesses',
  templateUrl: './illnesses.component.html',
  styleUrls: ['./illnesses.component.scss'],
  animations: [routerTransition()]
})

export class IllnessesComponent implements OnInit {
  illness: Illness;
  illnesses: Illness[] = [];
  public modalRef: BsModalRef;
  public errorMessage: string[] = [];

  constructor(
    private modalService: BsModalService,
    private illnessService: IllnessService,
    private regexService: RegexService
  ) { }

  ngOnInit() {
    this.illnessService.getIllnesses().subscribe((snapshots) => {
      this.illnesses = []
      snapshots.forEach((elem) => {
        let illness = Object.assign(new Illness(), elem.payload.toJSON())
        illness.key = elem.key;
        this.illnesses.push(illness)
      })
    })
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
    this.errorMessage = [];
  }

  public submitModal() {
    this.errorMessage = this.regexService.illnessValidation(this.illness)
    if(this.errorMessage.length < 1){
      if(!this.illness.key)
        this.illnessService.addIllness(this.illness)
      else
        this.illnessService.editIllness(this.illness)
      this.modalRef.hide()
      this.errorMessage = [];
    }
  }

  public removeIllness() {
    this.illnessService.removeIllness(this.illness)
    this.modalRef.hide()
  }

}

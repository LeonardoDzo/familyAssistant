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

  constructor(
    private modalService: BsModalService,
    private illnessService: IllnessService
  ) { }

  ngOnInit() {
    this.illnessService.getIllnessKeys().subscribe((keys) => {
      this.illnesses = []
      keys.forEach((elem) => {
        this.illnessService.getIllness(elem.key).subscribe((illness: Illness) => {
          illness.key = elem.key
          this.illnesses.push(illness)
        })
      })
    })
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
  }

  public submitModal() {
    if(!this.illness.key)
      this.illnessService.addIllness(this.illness)
    else
      this.illnessService.editIllness(this.illness)
    this.modalRef.hide()
  }

  public removeIllness() {
    this.illnessService.removeIllness(this.illness)
    this.modalRef.hide()
  }

}

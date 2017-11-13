import { RegexService } from './../../shared/services/regex.service';
import { IllnessService } from './../../shared/services/illness.service';
import { Illness } from './../../shared/models/illness';
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
  realIllnesses: Illness[] = [];
  public modalRef: BsModalRef;
  public errorMessage: string[] = [];
  public currentPage = 1;
  public totalItems = 0;
  public itemsPerPage = 10;

  constructor(
    private modalService: BsModalService,
    private illnessService: IllnessService,
    private regexService: RegexService
  ) { }

  ngOnInit() {
    this.illnessService.getIllnesses().subscribe((snapshots) => {
      //Se obtiene el arreglo de enfermedades.
      let illnesses: Illness[] = []
      snapshots.forEach((elem) => {
        let illness = Object.assign(new Illness(), elem.payload.toJSON())
        illness.key = elem.key;
        illnesses.push(illness)
      });
      
      //Se ordena el arreglo de enfermedades.
      illnesses.sort((a,b) => {
        if(a.nombre < b.nombre){
          return -1;
        } else if(a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });

      //Asignaciones necesarias para mostrar las enfermedades.
      this.realIllnesses = illnesses;
      this.totalItems = illnesses.length;
      this.illnesses = this.realIllnesses.slice(0,this.itemsPerPage);
    })
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
    this.errorMessage = [];
  }

  public search($event) {
    this.illnesses = this.realIllnesses.filter( item => {
      return item.nombre.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1;
    });

    this.currentPage = 1;
    this.totalItems = this.illnesses.length;
    this.illnesses = this.illnesses.slice(0,this.itemsPerPage);
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

  public pageChanged($event: any) {
    this.currentPage = $event.page;
    this.illnesses = this.realIllnesses.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);
    window.scrollTo(0, 0);
  }
}
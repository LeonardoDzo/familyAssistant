import { User } from './../../shared/models/user';
import { CrudService } from './../../shared/services/crud.service';
import { Subscription } from 'rxjs/Subscription';
import { RegexService } from './../../shared/services/regex.service';
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
  illnesses0: Illness[];
  illnesses1: Illness[];
  realIllnesses: Illness[] = [];
  public modalRef: BsModalRef;
  public errorMessage: string[] = [];
  public currentPage = 1;
  public totalItems = 0;
  public itemsPerPage = 10;
  sub: Subscription;
  userSub: Subscription;

  constructor(
    private modalService: BsModalService,
    private regexService: RegexService,
    private crudService: CrudService
  ) { 
    this.crudService.setTable("illnesses")
  }

  private init(user: User) {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.crudService.getObjects(user).subscribe((snapshots) => {
      //Se obtiene el arreglo de enfermedades.
      let illnesses: Illness[] = []
      snapshots.forEach((elem) => {
        let illness = Object.assign(new Illness(), elem.payload.toJSON())
        illness.id = elem.key;
        illnesses.push(illness)
      });
      
      //Se ordena el arreglo de enfermedades.
      illnesses.sort((a,b) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()){
          return -1;
        } else if(a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });

      //Asignaciones necesarias para mostrar las enfermedades.
      this.illnesses0 = illnesses.filter(illness => {
        return illness.type==0;
      })
      this.illnesses1 = illnesses.filter(illness => {
        return illness.type==1;
      })
      this.realIllnesses = illnesses;
      this.totalItems = illnesses.length;
      this.illnesses = this.realIllnesses.slice(0,this.itemsPerPage);
    }, error => {

    })
  }
  
  ngOnInit() {
    this.userSub = this.crudService.getUser().subscribe((user: User) => {
      this.init(user);
    }, error => {

    })
  }

  ngOnDestroy(){
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.userSub.unsubscribe();
    this.crudService.destroy();
  }

  public openModal(template: TemplateRef<any>,illness: Illness = new Illness()) {
    if(this.modalRef){
      this.modalRef.hide()
    }
    this.illness = Object.assign(new Illness(), illness);
    this.modalRef = this.modalService.show(template);
  }

  public search($event) {
    this.illnesses = this.realIllnesses.filter( item => {
      return item.name.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1;
    });

    this.currentPage = 1;
    this.totalItems = this.illnesses.length;
    this.illnesses = this.illnesses.slice(0,this.itemsPerPage);
  }

  public submitModal() {
    this.errorMessage = this.regexService.illnessValidation(this.illness)
    if(this.errorMessage.length < 1){
      if(!this.illness.id)
        this.crudService.addObject(this.illness)
      else
        this.crudService.editObject(this.illness)
      this.modalRef.hide()
      this.errorMessage = [];
    }
  }

  public removeIllness() {
    this.crudService.removeObject(this.illness)
    this.modalRef.hide()
  }

  public pageChanged($event: any) {
    this.currentPage = $event.page;
    this.illnesses = this.realIllnesses.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);
    window.scrollTo(0, 0);
  }
}

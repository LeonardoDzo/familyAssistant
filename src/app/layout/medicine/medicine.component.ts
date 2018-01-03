import { User } from './../../shared/models/user';
import { CrudService } from './../../shared/services/crud.service';
import { Subscription } from 'rxjs/Subscription';
import { RegexService } from './../../shared/services/regex.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from 'app/router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Medicine } from 'app/shared/models/medicine';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
  animations: [ routerTransition() ]
})

export class MedicineComponent implements OnInit {
  public modalRef: BsModalRef;
  public errorMessage: string[] = [];
  public medicine: Medicine;
  public medicines: Medicine[];
  public realMedicines: Medicine[];
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
    this.crudService.setTable("medicines")
  }

  private init(user: User) {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.crudService.getObjects(user).subscribe((snapshots) => {
      let medicines: Medicine[] = []
      snapshots.forEach((elem) => {
        let medicine = Object.assign(new Medicine(), elem.payload.toJSON())
        medicine.id = elem.key;
        medicines.push(medicine)
      })

      medicines.sort((a,b) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()){
          return -1;
        } else if(a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });

      this.realMedicines = medicines;
      this.totalItems = medicines.length;
      this.medicines = this.realMedicines;
      console.log(medicines)
    })
  }

  ngOnInit() {
    this.userSub = this.crudService.getUser().subscribe((user: User)=> {
      this.init(user);
    });
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
    this.userSub.unsubscribe();

    this.crudService.destroy();
  }

  public search($event) {
    this.medicines = this.realMedicines.filter( item => {
      return item.name.toLowerCase().toString().search($event.toLocaleLowerCase().toString()) != -1;
    });

    this.currentPage = 1;
    this.totalItems = this.medicines.length;
    this.medicines = this.medicines.slice(0,this.itemsPerPage);
  }

  public openModal(template: TemplateRef<any>,medicine: Medicine = new Medicine()) {
    if(this.modalRef) {
      this.modalRef.hide();
    }
    this.medicine = Object.assign(new Medicine(), medicine);
    this.modalRef = this.modalService.show(template);
    this.errorMessage = [];
  }

  submitModal() {
    this.errorMessage = this.regexService.medicineValidation(this.medicine)
    if(this.errorMessage.length < 1){
      if(!this.medicine.id)
        this.crudService.addObject(this.medicine);
      else
        this.crudService.editObject(this.medicine)
      this.modalRef.hide();
    }
  }

  removeMedicine() {
    this.crudService.removeObject(this.medicine)
    this.modalRef.hide();
  }

  public pageChanged($event: any) {
    this.currentPage = $event.page;
    this.medicines = this.realMedicines.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);
    window.scrollTo(0, 0);
  }
}

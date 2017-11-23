import { Subscription } from 'rxjs/Subscription';
import { MedicineService } from './../../shared/services/medicine.service';
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

  constructor(
    private medicineService: MedicineService,
    private modalService: BsModalService,
    private regexService: RegexService
  ) { }
  private init() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.medicineService.getMedicines().subscribe((snapshots) => {
      let medicines: Medicine[] = []
      snapshots.forEach((elem) => {
        let medicine = Object.assign(new Medicine(), elem.payload.toJSON())
        medicine.key = elem.key;
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
    })
  }

  ngOnInit() {
    this.medicineService.getUser().subscribe(()=> {
      this.init();
    });
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
    this.medicine = Object.assign(new Medicine(), medicine);
    this.modalRef = this.modalService.show(template);
    this.errorMessage = [];
  }

  submitModal() {
    this.errorMessage = this.regexService.medicineValidation(this.medicine)
    if(this.errorMessage.length < 1){
      if(!this.medicine.key)
        this.medicineService.addMedicine(this.medicine);
      else
        this.medicineService.editMedicine(this.medicine)
      this.modalRef.hide();
    }
  }

  removeMedicine() {
    this.medicineService.removeMedicine(this.medicine)
    this.modalRef.hide();
  }

  public pageChanged($event: any) {
    this.currentPage = $event.page;
    this.medicines = this.realMedicines.slice(this.itemsPerPage*(this.currentPage - 1),this.itemsPerPage*this.currentPage);
    window.scrollTo(0, 0);
  }

}

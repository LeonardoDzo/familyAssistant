import { MedicineService } from './../../shared/services/medicine.service';
import { RegexService } from './../../shared/services/regex.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from 'app/router.animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Medicine } from 'app/shared/services/medicine';

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

  constructor(
    private medicineService: MedicineService,
    private modalService: BsModalService,
    private regexService: RegexService
  ) { }

  ngOnInit() {
    this.medicineService.getMedicines().subscribe((snapshots) => {
      this.medicines = []
      snapshots.forEach((elem) => {
        let medicine = Object.assign(new Medicine(), elem.payload.toJSON())
        medicine.key = elem.key;
        this.medicines.push(medicine)
      })
    })
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

}

import { InsurancesService } from 'app/shared/services/insurances.service';
import { Insurance } from './../../shared/models/insurance';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.scss']
})
export class InsurancesComponent implements OnInit {
  carInsurances: Insurance[]
  homeInsurances: Insurance[]
  insurance: Insurance
  public modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private insurancesService: InsurancesService
  ) { }

  ngOnInit() {
    this.insurancesService.getUser().subscribe(user => {
      this.insurancesService.getInsurances().subscribe((insurances: Insurance[]) => {
        this.carInsurances = insurances.filter((ins) => {
          return ins.type == "car"
        })
        this.homeInsurances = insurances.filter((ins) => {
          return ins.type == "home"
        })
      })
    })
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}

import { Formcontrols } from './formcontrols';
import { Subscription } from 'rxjs/Subscription';
import { InsurancesService } from 'app/shared/services/insurances.service';
import { Insurance } from './../../shared/models/insurance';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.scss']
})
export class InsurancesComponent implements OnInit {
  carInsurances: Insurance[]
  homeInsurances: Insurance[]
  lifeInsurances: Insurance[]
  medicalInsurances: Insurance[]
  insurances: Insurance[]
  insurance: Insurance = new Insurance();
  public modalRef: BsModalRef;
  userSub: Subscription
  insurancesSub: Subscription
  file: File
  form: FormGroup = this.formBuilder.group({
    telephone: ["", [Validators.required,Validators.pattern(/^(\d{7,10})$/)]],
    name: ["",[]],
    file: ["",[]],
    policy: ["",[]]
  });
  selected: Insurance = new Insurance()
  formControls = new Formcontrols()
  constructor(
    private modalService: BsModalService,
    private insurancesService: InsurancesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userSub = this.insurancesService.getUser().subscribe(user => {
      this.selected = new Insurance()
      if(this.insurancesSub) {
        this.insurancesSub.unsubscribe()
      }
      this.insurancesSub = this.insurancesService.getInsurances().subscribe((insurances: Insurance[]) => {
        this.insurances = insurances
        this.carInsurances = insurances.filter((ins) => {
          return ins.type == "car"
        })
        this.homeInsurances = insurances.filter((ins) => {
          return ins.type == "home"
        })
        this.lifeInsurances = insurances.filter((ins) => {
          return ins.type == "life"
        })
        this.medicalInsurances = insurances.filter((ins) => {
          return ins.type == "medical"
        })
      })
    })
  }

  ngOnDestroy() {
    if(this.insurancesSub) {
      this.insurancesSub.unsubscribe();
    }
    this.userSub.unsubscribe();
  }

  fileChanged(files: any) {
    this.file = files[0];
  }

  public openModal(template: TemplateRef<any>,insurance: Insurance = new Insurance()) {
    this.insurance = insurance
    this.modalRef = this.modalService.show(template);
  }

  submit() {
    if(!this.form.controls.telephone.hasError('pattern')){
      this.insurancesService.addInsurance(this.insurance,this.file);
      this.modalRef.hide()
    }
  }
}

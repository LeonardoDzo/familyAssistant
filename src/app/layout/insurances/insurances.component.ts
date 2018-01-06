import { InsurancesService } from 'app/shared/services/insurances.service';
import { Insurance } from './../../shared/models/insurance';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.scss']
})
export class InsurancesComponent implements OnInit {
  carInsurances: Insurance[]
  homeInsurances: Insurance[]
  constructor(
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

}

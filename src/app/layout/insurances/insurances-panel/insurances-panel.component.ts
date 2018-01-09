import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Insurance } from './../../../shared/models/insurance';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap';
import { InsurancesService } from 'app/shared/services/insurances.service';

@Component({
  selector: 'app-insurances-panel',
  templateUrl: './insurances-panel.component.html',
  styleUrls: ['./insurances-panel.component.scss']
})
export class InsurancesPanelComponent implements OnInit {
  @Input()
  insurances: Insurance[];
  template: TemplateRef<any>
  insurance: Insurance
  public modalRef: BsModalRef;
  @Input()
  selected: Insurance = new Insurance();
  pdfSrc: any
  file: File
  constructor(
    private http: HttpClient,
    private modalService: BsModalService,
    private insurancesService: InsurancesService
  ) { }

  ngOnInit() {
  }

  removeParam(url){
    var urlparts= url.split('?');
    return urlparts[0];
  }

  isPdf() {
    if(this.selected.downloadUrl){
      let url = this.selected.downloadUrl
      url = this.removeParam(url)
      let filename = url.substring(url.lastIndexOf('/')+1);
      let ext = filename.split('.').pop()
      return ext == 'pdf'
    }
    return false;
  }

  fileChanged(files: any) {
    this.file = files[0];
  }

  changeSelected(insurance: Insurance) {
    this.selected = insurance;
  }

  removeInsurance() {
    this.insurancesService.removeInsurance(this.selected.id)
    this.selected = new Insurance()
    this.modalRef.hide()
  }

  openModalEdit(template: TemplateRef<any>,selected: Insurance) {
    this.selected = selected
    this.insurance = Object.assign(new Insurance(),this.selected);
    this.modalRef = this.modalService.show(template);
  }

  openModal(template: TemplateRef<any>) {
    this.insurance = Object.assign(new Insurance(),this.selected);
    this.modalRef = this.modalService.show(template);
  }
  
  submit() {
    this.insurancesService.update(this.insurance,this.file)
    this.selected = new Insurance()
    this.modalRef.hide()
  }

  isActive(item: Insurance) {
    return this.selected == item
  }
}

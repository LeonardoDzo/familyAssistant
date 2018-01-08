import { Insurance } from './../../../shared/models/insurance';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-insurances-panel',
  templateUrl: './insurances-panel.component.html',
  styleUrls: ['./insurances-panel.component.scss']
})
export class InsurancesPanelComponent implements OnInit {
  @Input()
  insurances: Insurance[];
  selected: Insurance = new Insurance();
  pdfSrc: any
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  removeParam(url){
    var urlparts= url.split('?');
    return urlparts[0];
  }

  isPdf() {
    if(this.selected.downloadUrl){
      let url = this.selected.downloadUrl
      console.log(url)
      url = this.removeParam(url)
      console.log(url)
      let filename = url.substring(url.lastIndexOf('/')+1);
      console.log(filename)
      let ext = filename.split('.').pop()
      console.log(ext)
      return ext == 'pdf'
    }
    return false;
  }

  changeSelected(insurance: Insurance) {
    this.selected = insurance;
  }

  isActive(item: Insurance) {
    return this.selected == item
  }
}

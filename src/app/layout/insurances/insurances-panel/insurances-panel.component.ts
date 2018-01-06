import { Insurance } from './../../../shared/models/insurance';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-insurances-panel',
  templateUrl: './insurances-panel.component.html',
  styleUrls: ['./insurances-panel.component.scss']
})
export class InsurancesPanelComponent implements OnInit {
  @Input()
  insurances: Insurance[];
  selected: Insurance = new Insurance();
  constructor() { }

  ngOnInit() {
  }

  removeParam(url){
    var urlparts= url.split('?');
    
    return urlparts[0];
  }

  isPdf() {
    let url = this.selected.downloadUrl
    url = this.removeParam(url)
    let filename = url.substring(url.lastIndexOf('/')+1);
    let ext = filename.split('.')[0]
    return ext == 'pdf'
  }

  changeSelected(insurance: Insurance) {
    this.selected = insurance;
  }
}

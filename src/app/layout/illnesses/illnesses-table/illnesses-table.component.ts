import { Illness } from './../../../shared/models/illness';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-illnesses-table',
  templateUrl: './illnesses-table.component.html',
  styleUrls: ['./illnesses-table.component.scss']
})
export class IllnessesTableComponent implements OnInit {
  @Input()
  illnesses: Illness[]
  @Input()
  title: string
  constructor() { }

  ngOnInit() {
  }

}

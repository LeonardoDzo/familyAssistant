import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Edit } from './edit'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  animations: [routerTransition()]
})
export class EditComponent implements OnInit {
  public edit: Edit;
  constructor() { }
  ngOnInit() { }
}

import { slideToTop } from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss'],
  animations: [slideToTop()]
})
export class FooComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

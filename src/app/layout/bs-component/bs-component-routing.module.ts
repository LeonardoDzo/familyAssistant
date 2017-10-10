import { ModalComponent } from './components/modal/modal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BsComponentComponent } from './bs-component.component';
import { FooComponent } from './components/foo/foo.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';

const routes: Routes = [
    { path: '', component: BsComponentComponent},
    { path: 'foo', component: FooComponent},
    { path: 'modal', component: ModalComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BsComponentRoutingModule { }

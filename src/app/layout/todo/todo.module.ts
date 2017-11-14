import { FormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TodoRoutingModule,
    FormsModule
  ],
  declarations: [TodoComponent]
})
export class TodoModule { }

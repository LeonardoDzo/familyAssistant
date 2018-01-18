import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'edit', loadChildren: './edit/edit.module#EditModule' },
            { path: 'contacts', loadChildren: './contactos/contactos.module#ContactosModule' },
            { path: 'safebox', loadChildren: './safebox/safebox.module#SafeboxModule'},
            { path: 'medkit', loadChildren: './illnesses/illnesses.module#IllnessesModule' },
            { path: 'medicine', loadChildren: './medicine/medicine.module#MedicineModule' },
            { path: 'todo', loadChildren: './todo/todo.module#TodoModule' },
            { path: 'insurances',loadChildren: './insurances/insurances.module#InsurancesModule' },
            { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }

import {FormControl, Validators} from '@angular/forms';

export class Formcontrols {
    insuranceType: FormControl = new FormControl("",[Validators.required]);
    insuranceName: FormControl = new FormControl("",[Validators.required]);
    insurancePolicy: FormControl = new FormControl("",[Validators.required]);
    insurancePhone: FormControl = new FormControl("",[Validators.required,Validators.pattern(/^(\d{7,10})$/)]);
}

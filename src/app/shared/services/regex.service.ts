import { Contacto } from './contacto';
import { Injectable } from '@angular/core';

@Injectable()
export class RegexService {
  nameRegExp: RegExp = /^[a-zA-Z áéíóúÁÉÍÓÚñÑ ,.'-]+$/;
  curpRegExp: RegExp = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;
  rfcRegExp: RegExp = /^([A-Z]{4})([0-9]{6})([A-Z]{6})([0-9]{2})$/;
  phoneNumberRegExp: RegExp = /^(\d{7,10})$/;

  constructor() { }

  contactValidation(contacto: Contacto): string[] {
    var errorMessages: string[] = [];

    if(!contacto.nombre) {
      errorMessages.push('El campo nombre es obligatorio.');
    } else if(!contacto.nombre.match(this.nameRegExp)) {
      errorMessages.push('El campo nombre tiene formato incorrecto.');
    }

    if(!contacto.telefono) {
      errorMessages.push('El campo teléfono es obligatorio.')
    } else if(!contacto.telefono.match(this.phoneNumberRegExp)) {
      errorMessages.push('El campo teléfono tiene formato incorrecto.');
    }

    if(!contacto.ocupacion) {
      errorMessages.push('El campo ocupación es obligatorio.')
    }

    return errorMessages;
  }

  name(): RegExp {
    return this.nameRegExp;
  }

  phoneNumber(): RegExp {
    return this.phoneNumberRegExp;
  }

  curp(): RegExp {
    return this.curpRegExp;
  }

  rfc(): RegExp {
    return this.rfcRegExp;
  }
}

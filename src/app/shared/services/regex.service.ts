import { Event } from './../models/event';
import { Illness } from '../models/illness';
import { Contacto } from '../models/contacto';
import { Injectable } from '@angular/core';
import { Medicine } from 'app/shared/models/medicine';

@Injectable()
export class RegexService {
  nameRegExp: RegExp = /^[a-zA-Z áéíóúÁÉÍÓÚñÑ ,.'-]+$/;
  curpRegExp: RegExp = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;
  rfcRegExp: RegExp = /^([A-Z]{4})([0-9]{6})([A-Z]{6})([0-9]{2})$/;
  phoneNumberRegExp: RegExp = /^(\d{7,10})$/;

  constructor() { }

  todoValidation(event: Event) {
    let errorMessages = [];

    if(!event.date) {
      errorMessages.push("Debe seleccionar una fecha...")
    }

    if(!event.name) {
      errorMessages.push("El pendiente debe tener un nombre...")
    }

    return errorMessages;

  }

  medicineValidation(medicine: Medicine) {
    let errorMessages = []
    if(!medicine.name) {
      errorMessages.push('El campo nombre es obligatorio.')
    }

    if(!medicine.dosage) {
      errorMessages.push('El campo dosis es obligatorio.')
    }

    if(!medicine.indications) {
      errorMessages.push('El campo indicaciones es obligatorio.');
    }

    return errorMessages;
  }

  illnessValidation(illness: Illness) {
    var errorMessages = [];

    if(!illness.nombre) {
      errorMessages.push('El campo nombre es obligatorio.')
    }

    if(!illness.medicine) {
      errorMessages.push('El campo medcamentos es obligatorio.')
    }

    return errorMessages;
  }

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

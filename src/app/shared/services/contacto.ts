export class Contacto {
    key: string;
    nombre: string;
    telefono: string;
    ocupacion: string;
    direccion: string = '';
    url: string = '';

    getName(): string {
        return this.nombre.slice(0,this.nombre.length);
    }
}

export class Contacto {
    id: string;
    name: string;
    phone: string;
    job: string;
    email: string = '';
    address: string = '';
    webpage: string = '';

    getName(): string {
        return this.name.slice(0,this.name.length);
    }
}

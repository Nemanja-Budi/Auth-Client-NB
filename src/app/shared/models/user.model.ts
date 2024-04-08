export class User {
    firstName: string;
    lastName: string;
    jwt: string;

    constructor(obj?: any) {
        this.firstName = obj && obj.firstName || '';
        this.lastName = obj && obj.lastName || '';
        this.jwt = obj && obj.jwt || '';
    }
}
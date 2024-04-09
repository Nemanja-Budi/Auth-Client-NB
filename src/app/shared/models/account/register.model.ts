export class Register{
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    constructor(obj?: any) {
        this.firstName = obj && obj.firstName || '';
        this.lastName = obj && obj.lastName || '';
        this.email = obj && obj.email || '';
        this.password = obj && obj.password || '';
    }
}
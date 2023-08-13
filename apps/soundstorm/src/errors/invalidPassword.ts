export class InvalidPassword extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidPassword';
    }
}
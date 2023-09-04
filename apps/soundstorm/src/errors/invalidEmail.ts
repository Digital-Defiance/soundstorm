export class InvalidEmail extends Error {
  public readonly email: string;

  constructor(email) {
    super('Invalid Email Address');
    this.email = email;
    this.name = 'InvalidEmail';
  }
}

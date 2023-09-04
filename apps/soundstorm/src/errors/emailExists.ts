export class EmailExistsError extends Error {
  public readonly email: string;
  constructor(email) {
    super('Email already exists');
    this.email = email;
    this.name = 'EmailExistsError';
  }
}

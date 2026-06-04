export class AppError extends Error {
  public toLog: boolean;

  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.toLog = false;
  }

  public logIt() {
    this.toLog = true;
  }
}

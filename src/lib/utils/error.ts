export class AppError extends Error {
  public readonly name: string = "AppError";
}

export class IllogicalError extends AppError {
  public readonly name: string = "IllogicalError";
}

export class UnexpectedError extends AppError {
  public readonly name: string = "UnexpectedError";
}

export class UnexpectedRepositoryError extends UnexpectedError {
  public readonly name: string = "UnexpectedRepositoryError";
}

export class UnexpectedMailerError extends UnexpectedError {
  public readonly name: string = "UnexpectedMailerError";
}

export class UnexpectedSessionError extends UnexpectedError {
  public readonly name: string = "UnexpectedSessionError";
}

export const notImplemented = () => {
  throw new AppError();
};

export const illogical = (message: string) => {
  throw new IllogicalError(message);
};

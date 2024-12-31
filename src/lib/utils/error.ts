export class AppError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "AppError";
  }
}

export class IllogicalError extends AppError {
  constructor(message?: string) {
    super(message);
    this.name = "IllogicalError";
  }
}

export const notImplemented = () => {
  throw new AppError();
};

export const illogical = (message: string) => {
  throw new IllogicalError(message);
};

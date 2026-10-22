export type ServiceError = "validation" | "not_found" | "storage";

export type Ok<T> = { ok: true; record: T };
export type Err = { ok: false; error: ServiceError; message: string };
export type Result<T> = Ok<T> | Err;

export function ok<T>(record: T): Ok<T> {
  return { ok: true, record };
}

export function err(error: ServiceError, message: string): Err {
  return { ok: false, error, message };
}

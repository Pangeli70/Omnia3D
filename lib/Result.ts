export interface Result<T> {
    ok: boolean;
    value?: T;
    error?: string;
}
export function ok<T>(value: T): Result<T> {
    return { ok: true, value };
}
export function isResult<T>(result: any): result is Result<T> {
    return result && typeof result === 'object' && 'ok' in result;
}
export function isOk<T>(result: Result<T>): result is Result<T> {
    return result.ok;
}
export function isError<T>(result: Result<T>): result is Result<T> {
    return !result.ok && typeof result.error === 'string';
}
export function error<T>(error: string): Result<T> {
    return { ok: false, error };
}
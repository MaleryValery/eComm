import ValidationErrors from './validation-errors';

type ValidationFn<T> = (value: T) => ValidationErrors | null;

export default ValidationFn;

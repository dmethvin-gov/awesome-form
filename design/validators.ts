
import xlate from 'translateMessage';
const messages = {
  required: "This field is required",
  integer: "This field must be an integer"
};

export function required(
  name: string,
  value: string|boolean,
  message: string = messages.required
): string|undefined {
  if ( value === undefined || value === '' ) {
    return xlate(message, name, value);
  }
}

export function integer(
  name: string,
  value: string,
  message: string = messages.integer
): string|undefined {
  if ( !/^[0-9]+$/.test(value) ) {
    return xlate(message, name, value);
  }
}

export function minimum(
  name: string,
  value: string,
  minValue: number,
  message: string = messages.minimum
): string|undefined {
  if ( +value < minValue ) {
    return xlate(message, name, value);
  }
}

export function dateBetween(
  name: string,
  value: string,
  minDate: string,
  maxDate: string,
  message: string = messages.dateBetween
): string|undefined {
  // TODO: should there be a compile-time checker for these args
  // convert minDate
  // convert maxDate
  // test range
}

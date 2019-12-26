
// TODO: integrate into error telemetry, console.log, unit tests, AND onscreen errors
import logger from 'logger';

export interface validatorArgs {
  name: string,
  value: string|undefined,
  message: string|undefined,
  [key: string]: any
}

/**
 * Validators take a data string, determine whether it meets the validation
 * criteria, and return either an empty string to indicate it does or a
 * string describing why the data does not meet the criteria.
 *
 * Although validators often convert the data in the process of doing their
 * checks, they do not return the converted data. That functionailty is
 * done by *converters*.
 */

export function validate(args: validatorArgs, msg: string, fn: function): string {
   return fn(args)? "" : validationMessage(args, msg);
}
export function validationMessage(args: validatorArgs, msg?: string): string {
  (args.message || msg || "(Validation failed but no message)").replace(
    /\${[\w\-]+}/g,
    arg => args[arg] || `(Missing validation argument: ${arg})`
  )
}

//------------------------------
// These need to be split into files so they can be found
//------------------------------

export function required(args: validatorArgs): string {
  return validate(
    args,
    "This value is required",
    args => args.value !== undefined && args.value !== ''
  );
}
export function number(args: validatorArgs): string {
  return validate(
    args,
    "This value must be a number",
    args => isFinite(+args.value)
  );
}
export function integer(args: validatorArgs): string {
  return validate(
    args,
    "This value must be an integer",
    args => /^-?[0-9]+$/.test(args.value)
  );
}
export function positive(args: validatorArgs): string {
  return validate(
    args,
    "This value must be a positive number",
    args => isFinite(+args.value) && +args.value >= 0
  );
}
export function minimum(args: validatorArgs): string {
  return validate(
    args,
    "This value cannot be less than ${minValue}",
    args => +args.value >= args.minValue,
  );
}
export function maximum(args: validatorArgs): string {
  return validate(
    args,
    "This value cannot be more than ${maxValue}",
    args => +args.value <= args.maxValue,
  );
}
export function validDate(args: validatorArgs): string {
  return validate(
    args,
    "This is not a valid date",
    parseDateISO(args.value)
  );
}
export function convertDate(date: string): string {
  let now = new Date();
  let baseDate = /^(\d\d\d\d)-(\d\d)-(\d\d)\b/.exec(date)

  while ( (relSpec = /([\+\-])(\d+)([year|month|day|week|hour|minute|second])s? ) ) {
    const [ addsub, n, unit ] = date;
    // TODO: use date-fns to add/subtract time
  }
  const [ ]
}
export function dateBetween(args: validatorArgs): string {
  const minDateISO = convertDate(args.minDate);
  logger.assert(minDateISO, "Invalid args.minDate:", args.minDate);
  const maxDateISO = convertDate(args.maxDate);
  logger.assert(maxDateISO, "Invalid args.maxDate:", args.maxDate);

  // String comparison works fine for ISO dates
  return validate(
    { ...args, minDateISO, maxDateISO },
    "Date must be between ${minDateISO} and ${maxDateISO}",
    args => args.value < args.minDateISO || args.value > args.maxDateISO
  );
}

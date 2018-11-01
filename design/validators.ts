
export interface validatorArgs {
  name: string,
  value: string|undefined,
  message: string|undefined,
  [key: string]: any
}

export function validate(args: validatorArgs, msg: string, fn: function): string {
  if ( fn(args) ) {
    return validationMessage(args, msg)
  }
  return "";
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
    args => args.value === undefined || args.value === ''
  );
}
export function number(args: validatorArgs): string {
  return validate(
    args,
    "This value must be a number",
    args => isNaN(+args.value) || !isFinite(+args.value)
  );
}
export function integer(args: validatorArgs): string {
  return validate(
    args,
    "This value must be an integer",
    args => !/^[0-9]+$/.test(value)
  );
}
export function minimum(args: validatorArgs): string {
  return validate(
    args,
    "This value cannot be less than ${minValue}",
    args => +args.value < args.minValue,
  );
}
export function validDate(args: validatorArgs): string {
  return validate(
    args,
    "This is not a valid date",
    !parseDateISO(args.value)
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
  const maxDateISO = convertDate(args.maxDate);
  // These indicate developer error, no need to localize
  if ( !minDateISO ) {
    return `ERROR: Invalid minDate in validator: ${args.minDate}`;
  }
  if ( !maxDateISO ) {
    return `ERROR: Invalid maxDate in validator: ${args.maxDate}`;
  }
  // String comparison works fine for ISO dates
  return validate(
    { ...args, minDateISO, maxDateISO },
    "Date must be between ${minDateISO} and ${maxDateISO}",
    args => args.value < args.minDateISO || args.value > args.maxDateISO
  );
}

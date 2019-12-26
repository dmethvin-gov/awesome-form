//-------------------------------------------------------------------------
// "Standard" fields in widget definitions
//
// field        string or null; Name of the field in local data and default field
//              name in submitted data; if null then no data stored locally or submitted
// widget       string; Path to widget in project, or name of previously defined widget
// label        string; HTML for label or title used in the widget
// value        string or number; value to use on initial display
// value        [ "fnRtnValue", args ]; function called to get initial value
// children     object; In grouping widgets, list of sub-widgets it contains
// merge        true/false; In object widgets, merge data into an existing object w same name
// validation   array-of-string or array-of-array-of-string; Validation rules passed to the widget
// className    string; Class name(s) added to some? element in the widget
// firstButton  string; In array widgets, label to use on the initial "create" button;
//              if not defined then the first element is shown but empty
// nextButton   string; In array widgets, label to use on the "add another" button
// showIf       [ "fnRtnBoolean", "fieldNames" ]; Displayed if function returns true
//              (also requiredIf, disabledIf, readOnlyIf, submitIf; generically "fieldIf")
// required      [ 'field1', 'field2' ]; In a grouping widget, defines required child fields
// submitAs     [ "fn", args ]; submit as the name-value pair returned (merged to form?)
//
//-------------------------------------------------------------------------

// Widget definitions
const widgets = {
  // Available form extensions; search in order if not defined explicitly
  // Search adds "widget/", "validation/", "fieldIf/", etc.
  '$PATHS': {
    'LOCAL': './js/extensions',
    'SOMEFORMLIB': './node_modules/some-form-lib/dist',
    'USFS': './node_modules/us-forms-system/dist/lib'
  },
  // Widget definitions can change default options
  'SSN': {
    widget: '$USFS/SSN',
    label: 'Social Security Number',
    validation: [ "required" ]
  },
  'Date': {
    widget: '$USFS/Date',
    format: 'mm/dd/yyyy'  // e.g., for display in errors
  },
  // Widgets can use already-defined widgets
  'AdultBirthDate': {
    widget: 'Date',
    label: 'Date of Birth',
    validation: [
      [ "required" ],
      [ "dateBetween", "1900-01-01", "-17 years", "Date of birth must be between ${1} and ${2}" ]
    ],
  },
  "Text-0-80": {
    widget: "Text",
    validation: [
      // Could we also allow this method? not sure how to do both without confusion
      {
        validator: "maxLength",
        maxLength: 80,
        message: "Please do not enter more than ${maxLength} characters"
      }
    ]
  },
  "Text-1-80": {
    widget: "Text",
    validation: [
      // TODO: Merge validations so that we could base off Text-0-80?
      [ "required" ],
      [ "maxLength",  80, "Please enter at least ${1} characters" ]
    ]
  },
  // Widgets can pull from multiple widgets
  'TrainingHoursType': {
    widget: 'RadioGroup',
    validation: [ "required" ],
    // RadioGroup copies defaults { widget: 'Radio', field } ?
    children: [
      { value: 'semester', label: 'Semester' },
      { value: 'quarter',  label: 'Quarter' },
      { value: 'clock',    label: 'Clock'  }
    ]
  },
  'FullName': {
    // Widget can define a default field name
    field: 'fullName',
    widget: 'FieldGroupObject',
    children: [
      // Fields can use a shorthand array syntax
      [ "first", "Text-1-80" "First Name" ],
      [ "middle", "Text-0-80", "Middle Name" ],
      [ "last", "Text-1-80", "Last Name" ],
    ]
  }
};
const validators = {
  '$PATHS': {
    'LOCAL': './js/extensions',
    'SOMEFORMLIB': './node_modules/some-form-lib/dist',
    'USFS': './node_modules/us-forms-system/dist/lib'
  },
  'DateSince1990': {
    validation: [
      {
        validator: "DateSince",
        date: "1990-01-01",
        message: "Date cannot be before 1990"
      }
    ],
  }
};

//-------------------------------------------------------------------------

const pages = [
  {
    chapter: 'Applicant Information',
    label: '',
    widget: 'PageDisplayGroup',
    children: [
      // Short (array) syntax, when widget defaults are sufficient
      // [ fieldname, widget, label, initialValue ]
      [ 'veteranFullName', 'FullName', 'Full Name' ],
      [ 'veteranSocialSecurityNumber', 'SSN', 'Social Security Number' ],
      [ 'veteranDateOfBirth', 'AdultBirthDate', 'Date of Birth' ],
      [ 'gender', 'Gender', 'Gender' ]
    ]
  },
  {
    chapter: 'Benefits Eligibility',
    label: '',
    widget: 'PageDisplayGroup',
    children: [
      // Long (object) syntax
      {
        widget: 'Fieldset',
        label: 'You may be eligible for more than 1 education benefit ...',
        validation: [
          // "anyChecked" is a showIf-style function
          [ "validIf", "anyChecked" [
            "chapter33Checkbox", "chapter30Checkbox", "chapter1606Checkbox", "chapter32Checkbox"
          ], "You must select at least one benefit." ]
        ],
        children: [
          {
            field: "chapter33Checkbox",
            widget: "Checkbox",
            label: "Post-9/11 GI Bill (Chapter 33) ...",
            children: [
              [ "", "ExpandUnderText", "When you choose to apply for your Post-9/11 benefit, ..." ]
            ]
          },
          [ 'chapter30Checkbox', 'Checkbox','Montgomery GI Bill (MGIB-AD, Chapter 30) ...' ],
          [ 'chapter1606Checkbox', 'Checkbox','Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606) ...' ],
          [ 'chapter32Checkbox', 'Checkbox', 'Post-Vietnam Era Veterans’ Educational Assistance Program ...' ]
        ]
      }
    ]
  },
  {
    chapter: 'Benefits Eligibility',
    label: 'Benefits Relinquishment',
    widget: 'PageDisplayGroup',
    showIf: [ "isChecked", "chapter33Checkbox" ],
    children: [
      // Hidden field containing today's date (LOCAL TIME), see function above
      // (Use label as the data type? Use initialValue as the arg to it?)
      [ 'benefitsRelinquishedDate', 'Hidden', 'DATE', ''],
      {
        field: 'benefitsRelinquished',
        widget: 'RadioGroup',
        label: 'Because you chose to apply for your Post-9/11 benefit, ...',
        validation: [ "required" ],
        // RadioGroup copies defaults { widget: 'Radio', field: 'benefitsRelinquished' }
        children: [
          { value: 'chapter32', label: 'I\'m only eligible for the post-9/11 GI Bill' },
          { value: 'chapter30', label: 'Montgomery GI Bill (MGIB-AD, Chapter 30)' },
          { value: 'chapter1606', label: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)' },
          { value: 'chapter1607', label: 'Reserve Educational Assistance Program (REAP, Chapter 1607)' }
        ]
      }
    ]
  },
  {
    chapter: 'Military History',
    label: 'Service Periods',
    // TODO define how  multi-page display works (check current code)
    widget: 'PageDisplayGroupArray',
    field: 'servicePeriods',
    nextButton: 'Add another service period',
    children: [
      [ null, 'Subhead', 'Please record all your periods of service' ],
      [ 'serviceBranch','Text-1-80', 'Branch of Service' ],
      [ 'serviceStatus', 'Text', 'Type of service ...' ],
      [ 'dateRange', 'ServiceMonthYearRange', 'Service start and end date' ],
      {
        field: "applyPeriodToSelected",
        widget: "Checkbox",
        label: "Apply this service period to the benefit I’m applying for.",
        value: true,
        showChildrenValue: false,
        children: [
          [ "benefitsApplyTo", "Textarea", "Please explain how you’d like this service period applied." ],
          [ null, "BodyText", "A single period of service may not be applied toward more than one benefit. ..." ]
        ]
      }
    ]
  },
  {
    chapter: 'Military History',
    label: '',
    widget: 'PageDisplayGroup',
    children: [
      [ 'serviceAcademyGraduationYear', 'CurrentOrPastYear', 'If you received a commission ...' ],
      {
        field: "currentlyActiveDuty",
        widget: "FieldGroupObject",
        children: [
          {
            field: "yes",
            widget: "YesNo",
            showChildrenWhen: "Yes",
            children: [
              [ "onTerminalLeave", "YesNo", "Are you on terminal leave now?" ]
            ]
          }
        ]
      }
    ]
  },
  {
    chapter: 'Military History',
    label: 'ROTC History',
    widget: 'PageDisplayGroup',
    children: [
      [ 'seniorRotcScholarshipProgram', 'YesNo', 'Are you in a senior ROTC scholarship ...' ],
      [ 'seniorRotc', 'YesNo', 'Were you commissioned as a result of senior ROTC?' ],
      {
        widget: 'FieldGroupObject',
        showIf: [ "isYes", "seniorRotc" ]
        children: [
          [ 'commissionYear', 'PastOrPresentYear', 'Commission Year' ],
          {
            field: 'rotcScholarshipAmounts',
            widget: 'FieldGroupArray',
            label: 'ROTC Scholarships',
            firstButton: 'Add a scholarship',
            nextButton: 'Add another scholarship',
            children: [
              [ 'year', 'PastOrPresentYear', 'Year Scholarship was received' ],
              [ 'amount', 'DollarAmount', 'Scholarship Amount' ]
            ]
          }
        ]
      }
    ]
  },
  {
    chapter: 'Military History',
    label: 'Contributions',
    widget: 'PageDisplayGroup',
    children: [
      [ null, 'Subhead', 'Select all that apply:' ],
      [ 'civilianBenefitsAssistance', 'Checkbox', 'I am receiving benefits from the U.S. Government ...' ],
      [ 'additionalContributions', 'Checkbox', 'I made contributions (up to $600) to increase the amount ...' ],
      [ 'activeDutyKicker', 'Checkbox', 'I qualify for an Active Duty Kicker ...' ],
      [ 'reserveKicker', 'Checkbox', 'I qualify for a Reserve Kicker ...' ],
      [ 'activeDutyRepay', 'Checkbox', 'I have a period of service that the Department of Defense ...' ],
      {
        field: "",
        widget: 'Checkbox',
        label: 'I have a period of service that the Department of Defense ...'
        children: [
          [ "activeDutyRepayingPeriod", "PastOrPresentDateRange", "Enter service period" ]
        ]
      },
    ]
  },
  {
    chapter: 'Education History',
    label: '',
    widget: 'PageDisplayGroup',
    children: [
      [ 'highSchoolOrGedCompletionDate', 'PastOrCurrentMonthYear', 'When did you earn your high school diploma ...' ],
      [ null, 'Subhead', 'Please list any courses or training programs ...' ],
      {
        field: 'postHighSchoolTrainings',
        widget: 'FieldGroupArray',
        label: 'Education after high school',
        addButton: 'Add another training',
        children: [
          [ 'name', 'Text-1-80', 'Name of college, university or other training provider' ],
          [ 'city', 'Text', 'City' ],
          [ 'state', 'StateSelect', 'State' ],
          [ 'dateRange', 'PastOrCurrentMonthYearRange', 'Dates attended' ],
          [ 'hours', 'Number', 'Hours completed' ],
          [ 'hoursType', 'TrainingHoursType', 'Type of hours' ],
          [ 'degreeReceived', 'Text', 'Degree, diploma or certificate received' ],
          [ 'major', 'Text', 'What did you study?' ]
        ]
      },
      [ 'faaFlightCertificatesInformation', 'Textarea', 'If you have any FAA flight certificates ...' ],
    ]
  },
  {
    chapter: 'Employment History',
    widget: 'PageDisplayGroup',
    label: '',
    children : [
      {
        field: 'nonMilitaryJob',
        widget: 'YesNo',
        label: 'Have you ever held a license of journeyman rating ...'
        submitAs: null  // Don't submit this field
      },
      {
        field: 'nonMilitaryJobs',
        widget: 'FieldGroupArray',
        showIf: ["isYes", 'nonMilitaryJob' ],
        addButton: 'Add another employment period',
        children: [
          {
            field: 'postMilitaryJob',
            widget: 'RadioGroup',
            children: [
              { value: false, label: 'Before military service' },
              { value: true, label: 'After military service' }
            ]
          }
          [ 'name', 'Text', 'Main job' ],
          [ 'months', 'Number', 'Number of months worked' ],
          [ 'licenseOrRating', 'Text', 'Licenses or rating' ]
        ]
      },
    ]
  },
  {
    chapter: "School Selection",
    widget: 'PageDisplayGroup',
    label: '',
    children: [
      {
        field: 'educationProgram',
        widget: 'FieldGroupObject',
        children: [
          [ 'name', 'Text-1-80', 'Name of school, university, or training program' ],
          {
            field: 'type',
            widget: 'Select',
            label: 'Type of education or training',
            validation: [ "required" ],
            // Select widget copies { widget: 'Option' } to children ?
            children: [
              { value: 'college', label: 'College, university, or other ...' },
              { value: 'correspondence', label: 'Correspondence' },
              { value: 'apprenticeship', label: 'Apprenticeship or on-the-job training' },
              { value: 'flightTraining', label: 'Vocational flight training' },
              { value: 'testReimbursement', label: 'National test reimbursement ...' },
              { value: 'licensingReimbursement', label: 'Licensing or certification test ... ' },
              { value: 'tuitionTopUp', label: 'Tuition assistance top-up ...' }
            ]
          }
        ]
      },
      [ 'educationObjective', 'Textarea', 'Education or career goal ...' ],
      [ 'educationStartDate', 'Date', 'Date your training began or will begin' ],
      {
        field: "nonVaAssistance",
        widget: "YesNo",
        label: "Are you getting, or do you expect to get any money ...",
        submitAs: [ "mergeTo", "currentlyActiveDuty" ]
      }
    ]
  },
  {
    chapter: 'Personal Information',
    widget: 'PageDisplayGroup',
    label: 'Contact Information',
    children: [
      {
        field: 'preferredContactMethod',
        widget: 'RadioGroup',
        validation: [ "required" ],
        children: [
          { value: 'mail', label: 'Mail' },
          { value: 'email' label: 'Email' },
          { value: 'phone', label: 'Phone' }
        ]
      },
      [ 'veteranAddress', 'PostalAddress', 'Address' ],
      {
        widget: 'Fieldset',
        label: 'Other contact information',
        // TODO: convert to function-call format?
        required: [ 'email', 'homePhone' ],
        children: [
          [ 'email', 'EmailWithConfirm', 'Email address' ],
          [ 'homePhone', 'Phone', 'Primary telephone number' ],
          [ 'cellPhone', 'Phone', 'Secondary telephone number' ]
        ]
      }
    ]
  },
  {
    chapter: 'Personal Information',
    widget: 'PageDisplayGroup',
    label: 'Secondary contact',
    children: [
      {
        field: "secondaryContact",
        widget: 'FieldGroupObject',
        label: 'This person should know where you can be reached ...',
        children: [
          [ 'fullName', 'Text', 'Name' ],
          [ 'phone', 'Phone', 'Telephone number' ],
          [ 'sameAddress', 'Checkbox', 'Address for secondary contact is the same as mine' ],
          {
            field: 'address',
            widget: 'PostalAddress',
            showIf: [ "isChecked", "sameAddress" ]
          }
        ]
      }
    ]
  },
  {
    chapter: 'Personal Information',
    widget: 'PageDisplayGroup',
    label: 'Direct deposit',
    children: [
      [ null, 'Subhead', 'VA makes payments only through direct deposit ...' ],
      {
        field: 'bankAccount',
        widget: 'FieldGroupObject',
        label: '',
        children: [
          {
            field: 'accountType',
            widget: 'RadioGroup',
            label: 'Account Type',
            children: [
              { value: 'checking', label: 'Checking' },
              { value: 'savings', label: 'Savings' }
            ]
          },
          [ 'bankAccountNumber', 'BankAccountNumber', 'Bank account number' ],
          [ 'routingNumber', 'Text', 'Routing number' ]
        ]
      }
    ]
  },
  {
    chapter: 'Personal Information',
    widget: 'PageDisplayGroup',
    label: 'Dependent information',
    // TODO: Passed the array of serviceHistory records
    showIf: [ "hasServiceBefore1977", "serviceHistory" ],
    children: [
      [ 'married', 'YesNo', 'Are you currently married?' ],
      [ 'haveDependents', 'YesNo', 'Do you have any dependents who fall into ...' ],
      [ 'parentDependent', 'YesNo', 'Do you have a parent who is dependent ...' ]
    ]
  }

];


//-------------------------------------------------------------------------

const formConfig = { };

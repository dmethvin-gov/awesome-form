//-------------------------------------------------------------------------
// "Standard" fields in widget definitions
//
// field        string or null; Name of the field in local data and default field
//              name in submitted data; if null then no data stored locally or submitted
// widget       string; Path to widget in project, or name of previously defined widget
// label        string; HTML for label or title used in the widget
// initialValue string or number; value to use on first display
// initialValue function(fieldName, localData); function returning value to use
// children     object; In grouping widgets, list of sub-widgets it contains
// merge        true/false; In object widgets, merge data into an existing object w same name
// validation   object; Validation rules passed to the widget
// className    string; Class name(s) added to the HTML element
// addFirstButton string; In array widgets, HTML to use on the initial "create" button;
//              if not defined then the first element is shown but empty
// addNextButton string; In array widgets, HTML to use on the "add another" button
// showIf       'field1|field2'; This field displayed if at least one field is checked/non-empty
// showIf       function(thisFieldName, localData); Displayed if function returns true
// showUnless   'field1|field2'; This field displayed if at least one field is unchecked/empty
//              (Data from non-shown fields are not submitted or validated)
// required      [ 'field1', 'field2' ]; In a grouping widget, defines required child fields
// requiredIf   'field1|field2'; This field required if at least one field is checked/non-empty
// requiredUnless 'field1|field2'; This field required if at least one field is unchecked/empty
// disabledIf   'field1|field2'; This field is disabled if at least one field is checked/non-empty
// disabledUnless 'field1|field2'; This field disabled if at least one field is unchecked/empty
// value        string; (initial) Value of the widget
// submitAs     null; // do not submit a value (only used locally)
// submitAs     "name"; submit using the field name "name"
// submitAs     function(fieldName, data/childFields) => string/object/null;
//              (By default the value is submitted using the same name as `field`)
//
//-------------------------------------------------------------------------

// Person should be at least 18 years old; used below
var MaxAdultBirthDate = new Date();
MaxAdultBirthDate.setFullYear(MaxAdultBirthDate.getFullYear()-18);

// Widget definitions
const widgets = {
  // Widgets available; search paths in order if not defined explicitly
  '$PATHS': {
    'LOCAL': './widgets',
    'SOMEFORMLIB': './node_modules/some-form-lib/widgets',
    'USFS': './node_modules/us-forms-system/dist/widgets'
  },
  // Widget definitions can change default options
  'SSN': {
    widget: '$USFS/SSN',
    label: 'Social Security Number'
  },
  'Date': {
    widget: '$USFS/Date',
    format: 'mm/dd/yyyy'  // for display
  },
  // Widgets can use already-defined widgets
  'AdultBirthDate': {
    widget: 'Date',
    label: 'Date of Birth',
    validation: {
      minDate: [
        '1900-01-01',
        'Date of birth must be after ${minDate}'
      ],
      maxDate: [
        MaxAdultBirthDate, // Converted to ISO8601 string
        'Date of birth must be no later than ${maxDate}'
      ]
    }
  },
  // Widgets can pull from multiple widgets
  'TrainingHoursType': {
    widget: 'RadioGroup',
    // RadioGroup copies defaults { widget: 'Radio', field } ?
    children: [
      { value: 'semester', label: 'Semester' },
      { value: 'quarter',  label: 'Quarter' },
      { value: 'clock',    label: 'Clock'  }
    ]
  },
  'FullName': {
    field: 'fullName',
    widget: 'FieldGroupObject',
    children: [
      {
        field: 'first',
        widget: 'Text',
        label: "First Name",
        validation: { minLength: 1, maxLength: 50 }
      },
      {
        field: 'middle',
        widget: 'Text',
        label: 'Middle Name',
        validation: { maxLength: 50 }
      },
      {
        field: 'last',
        widget: 'Text',
        label: 'Last Name',
        validation: { minLength: 2, maxLength: 50 }
      }
    ]
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
        validation: {
          // FieldGroup isn't focusable so this validates on page navigation?
          errorUnless: [
            'chapter33Checkbox|chapter30Checkbox|chapter1606Checkbox|chapter32Checkbox',
            'You must select at least one benefit.'
          ]
        },
        children: [
          [ 'chapter33Checkbox', 'Checkbox', 'Post-9/11 GI Bill (Chapter 33) ...' ],
          {
            widget: 'HTML',
            showIf: 'chapter33Checkbox',
            className: 'expand-under',
            label: 'When you choose to apply for your Post-9/11 benefit, ...'
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
    showIf: 'chapter33Checkbox',
    required: [ 'benefitsRelinquished' ],
    children: [
      // Hidden field containing today's date (LOCAL TIME), see function above
      [ 'benefitsRelinquishedDate', 'Hidden', '', () => {
        const now = Date.now();
        return now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
      }],
      {
        field: 'benefitsRelinquished',
        widget: 'RadioGroup',
        label: 'Because you chose to apply for your Post-9/11 benefit, ...',
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
    addNextButton: 'Add another service period',
    required: [ 'serviceBranch', 'dateRange' ]
    children: [
      [ null, 'HTML', 'Please record all your periods of service' ],
      [ 'serviceBranch','Text', 'Branch of Service' ],
      [ 'serviceStatus', 'Text', 'Type of service ...' ],
      [ 'dateRange', 'PastOrPresentMonthYearRange', 'Service start and end date' ],
      [ 'applyPeriodToSelected', 'Checkbox', 'Apply this service period to the benefit I’m applying for.' ],
      {
        widget: 'FieldGroupObject',
        displayUnless: 'applyPeriodToSelected',
        className: 'display-under',
        children: [
          {
            field: 'benefitsApplyTo',
            widget: 'Textarea',
            requiredUnless: 'applyPeriodToSelected',
            label: 'Please explain how you’d like this service period applied.'
          },
          {
            widget: 'HTML',
            label: 'A single period of service may not be applied toward more than one benefit. ...'
          }
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
        field: 'currentlyActiveDuty',
        widget: 'FieldGroupObject',
        merge: true, // currentlyActiveDuty object is used in different places in the form
        children: [
          [ 'yes', 'YesNo', 'Are you on active duty now?' ],
          {
            field: 'onTerminalLeave',
            widget: 'YesNo',
            label: 'Are you on terminal leave now?',
            showIf: 'currentlyActiveDuty.yes'
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
        displayIf: 'seniorRotc'
        children: [
          [ 'commissionYear', 'PastOrPresentYear', 'Commission Year' ],
          {
            field: 'rotcScholarshipAmounts',
            widget: 'FieldGroupArray',
            label: 'ROTC Scholarships',
            addFirstButton: 'Add a scholarship',
            addNextButton: 'Add another scholarship',
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
      [ null, 'HTML', 'Select all that apply:' ],
      [ 'civilianBenefitsAssistance', 'Checkbox', 'I am receiving benefits from the U.S. Government ...' ],
      [ 'additionalContributions', 'Checkbox', 'I made contributions (up to $600) to increase the amount ...' ],
      [ 'activeDutyKicker', 'Checkbox', 'I qualify for an Active Duty Kicker ...' ],
      [ 'reserveKicker', 'Checkbox', 'I qualify for a Reserve Kicker ...' ],
      [ 'activeDutyRepay', 'Checkbox', 'I have a period of service that the Department of Defense ...' ],
      {
        field: 'activeDutyRepay',
        widget: 'Checkbox',
        label: 'I have a period of service that the Department of Defense ...'
        submitAs: null
      },
      {
        field: 'activeDutyRepayingPeriod',
        widget: 'PastOrPresentDateRange',
        displayIf: 'activeDutyRepay'
      }
    ]
  },
  {
    chapter: 'Education History',
    label: '',
    widget: 'PageDisplayGroup',
    children: [
      [ 'highSchoolOrGedCompletionDate', 'PastOrCurrentMonthYear', 'When did you earn your high school diploma ...' ],
      [ null, 'HTML', 'Please list any courses or training programs ...' ],
      {
        field: 'postHighSchoolTrainings',
        widget: 'FieldGroupArray',
        label: 'Education after high school',
        addButton: 'Add another training',
        required: [ 'name', 'hoursType' ],
        children: [
          [ 'name', 'Text', 'Name of college, university or other training provider' ],
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
        displayIf: 'nonMilitaryJob',
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
        required: [ 'name', 'type' ],
        children: [
          [ 'name', 'Text', 'Name of school, university, or training program' ],
          {
            field: 'type',
            widget: 'Select',
            label: 'Type of education or training',
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
        field: 'currentlyActiveDuty',
        widget: 'FieldGroupObject',
        merge: true, // currentlyActiveDuty object is used in different places in the form
        children: [
          [ 'nonVaAssistance', 'YesNo', 'Are you getting, or do you expect to get any money ...' ]
        ]
    ]
  },
  {
    chapter: 'Personal Information',
    widget: 'PageDisplayGroup',
    label: 'Contact Information',
    required: [ 'preferredContactMethod' ],
    children: [
      {
        field: 'preferredContactMethod',
        widget: 'RadioGroup',
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
        widget: 'FieldGroupObject',
        label: 'This person should know where you can be reached ...',
        children: [
          [ 'fullName', 'Text', 'Name' ],
          [ 'phone', 'Phone', 'Telephone number' ],
          [ 'sameAddress', 'Checkbox', 'Address for secondary contact is the same as mine' ],
          {
            field: 'address',
            widget: 'PostalAddress',
            displayUnless: 'sameAddress',
            label: ''
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
      [ null, 'HTML', 'VA makes payments only through direct deposit ...' ],
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
    showIf: hasServiceBefore1977, // Here, passed (undefined, localData) => boolean
    children: [
      [ 'married', 'YesNo', 'Are you currently married?' ],
      [ 'haveDependents', 'YesNo', 'Do you have any dependents who fall into ...' ],
      [ 'parentDependent', 'YesNo', 'Do you have a parent who is dependent ...' ]
    ]
  }

];


//-------------------------------------------------------------------------

const formConfig = { };

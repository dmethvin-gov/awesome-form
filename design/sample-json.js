
// Pages, list of form elements in each page

// Page structure
// Define pages as an array of field names (defined below).
// A field should only be mentioned on one page since it defines a unique
// set of output data (array fields are somewhat special). We can enforce
// the fields-unique-across-pages constraint via audit.
//
// Chapters can be added here by nested structure, or perhaps it makes more
// sense to mark their chapter membership in the page info itself? If done
//
// Pages may not appear based on answers from previous pages.
// Pages may be duplicated to new pages (e.g., relatives or service periods)

form: [
	{
		title: "User information",
		fields: [
		 "fullName",
		 "email",
		 "phone",
		 "mailingAddress"
	 ]
	}
	serviceRecords: [
		"servicePeriods"
	]

]


// ------------

widgetCommonOptions = {
	translation: ...,
	locale: ...
}

{
	// Defines the name of the field in `local` and the default name in `submit`
	field: "fieldName",
	// Name of the widget used to render this field--string lookup, or `import`?
	widget: "MyWidget",
	// Options passed to the widget, these are widget-specific
	options: {
		label: "Zip Code",
		useZipPlus4: true
	}
	// Conditionally display this field based on another field. Usually a checkbox
	// (checked) but could also be text field (non-empty) or numeric (non-zero).
	// Can be a function(fieldDefinition, local) ==> Boolean, called when data
	// changes and the field might be displayed (i.e., on the "active page").
	// displayUnless just reverses the condition (display unless a box is checked)
	show: true/false/myfunc,
	showIf: "otherField",
	showUnless: "someOtherField",
	// Initial value to set for the element(s). For object widgets this can set
	// some or all of the sub-properties. (N.B. validate after setting?)
	// This can also be a function(fieldDefinition, local) ==> initialValue,
	// called when the "page" is entered first time or before submit?
	// Is this value set or sent when showIf is false?
	initialValue: "Extremely widgety",
	// Validations for value returned from the widget. If it returns an object
	// it should look at the first-level props which represent the sub-properties
	// of the widget and validate them individually. Validations are similar to
	// the ones in JSON Schema: min, max, minLength, maxLength, pattern
	// Can be a function(fieldDefinition, local, value) ==> errorArray
	// Validates on field loss of focus, submit, or "move to next page (TBD)"
	validate: {
		// Must be filled; can be function(fieldDefinition, local) ==> Boolean
		required: true/false/myfunc,
		// Field is required if/unless other field(s) checked/non-empty
		requiredIf: "someField|secondField", // any non-empty or checked
		requiredUnless: "otherField|anotherField", // any non-empty or checked
		// Up to 50 characters (string)
		maxLength: 50,
		// Must match this pattern
		pattern: /@/,
		// Override default error messages
		MESSAGES: {
			pattern: "Value must contain the at-sign (@) character"
		}
	},
	// Where to put this data when the form is submitted. The default is to use
	// the same name/structure as the `local` value so `submit.fieldName`.
	// This can be an object mapping the widget name into submit name, or a
	// string for the new name of the top-level object,
	// or a function(fieldDefinition, local, submit) ==> newName
	submit: "submittedFieldName"

}
//----------

fields: [
	{
		// local.fullName.{first, last, middle}
		field: "fullName",
		label: "Full Name",
		widget: "CompleteName",
		required: true,
		validate: {
			first: { maxLength: 50 },
			middle: { maxLength: 50 },
			last: { maxLength: 50 }
		}
		// default is merge(remote.fullName, local.fullName)
		// use `remoteTarget: form` to merge(remote, local.fullName)?
		formTarget: {
			first: "first",
			last: "last",
			middle: "middle"
		}
	},
	{
		// data.email
		field: "email",
		label: "Email",
		widget: "EmailAddress",
		required: true,
		formTarget: {
			// form.primaryEmail = data.email before submit
			email: "primaryEmail"
		},
	},
	{
		field: "textUpdates",
		label: "Send text updates to my mobile phone",
		// assigns a Boolean to data.textUpdates
		widget: "Checkbox"
		// by default, form.textUpdates = data.textUpdates
	},
	{
		field: "primaryPhone",
		label: "Primary Phone",
		widget: "PhoneNumber",
		options: {
			includeCountryCode: true
		}
		// by default, form.primaryPhone = data.primaryPhone
	},
	{
		field: "printedNews",
		label: "Send the monthly printed newsletter"
		widget: "Checkbox",
		// by default, form.printedNews = data.printedNews
	},
	{// --------------------------- CHILDREN
		field: "mailingAddress"
		label: "Mailing Address"
		widget: "Fieldset",
		showIf: "printedNews",
		children: [
			{
				widget: "MailingAddress",
				required: true,
				formTarget: { value: "address1" }
			}
		]
	},
	{
		field: "benefitsChoices",
		label:
	}
];

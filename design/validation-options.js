


  title: [ "fromFormData", "Information on ${relation.fullName} injury" ]

// Scenario: SSN textbox and a "I don't have an SSN" checkbox

{
  field: "noSSN",
  widget: "Checkbox",
  label: "No Social Security Number",
  // ... more definitions ...
},
{
  field: "SSN",
  widget: "Text",
  // ... more definitions ...

  //---- OPTION 1: show as disabled (and don't validate) if box is checked
  disabledIf: [ "isChecked", "noSSN" ],

  //---- OPTION 2: hide from view (and don't validate) if box is checked
  showIf: [ "isNotChecked", "noSSN" ],

  //---- OPTION 3: leave enabled, give an error if checked+filled
  validations: [
    [ "lengthBetween", 10, 10, "SSN length should be 10 characters" ],
    [ "InvalidIf",
      [ "AND", [ "isChecked", "noSSN" ], [ "isNotEmpty", "SSN" ] ]
      "Do not fill this field if you check 'No Social Security Number'"
    ],
  ],
  // Needed with option 3 since the field is always showing and enabled
  requiredIf: [ "isNotChecked", "noSSN" ],
}

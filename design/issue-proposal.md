
## Issue: Potential users want flexibility in navigation and routing

### Current solutions

* Library requires React Router 3
* Library requires Redux
* Form data processing is tied to navigation and routing

#### Pros

* Provides a "known environment"
  - Don't need many extension point APIs beyond `formConfig`
  - Simplifies our testing, don't need to accommodate other setups
* It's what the code does today (few changes needed)
* Already have a site where it works (vets.gov)

#### Cons

* Not all users want/need/like the pages-and-chapters design
  - Creators of new SF-86 have a multi-server-page model but want to use our form
* Prescribing dependencies limits flexibility and adds to file size
  - Some users want RR3, some RR4, others no formal router
  - Simple form doesn't need Redux; others prefer Mobx, Flux, etc.
* Limits adoption by others with different needs

### Alternatives

* Move router/navigation and Redux code to starter app
  - Apps can choose a different router and state manager
* Create API hooks inside us-forms-system:
  - Report "pages" to app
    + "Pages" are just collections of fields inside the larger form
    + In the current design, a route shows a "page"
  - Open a page
    + Show the fields, with either blank values or `initialData`
  - Close a page
    + Validate the fields on the page, may return an error to prevent nav
  - Callback to report changes on form data
    + Reported in a format that lets them be used as `initialData` later
  - Open the Review page
    + Optional? Doesn't seem like it should be required
    + Do we need to pay the cost of duplicate review widgets?
    + Could an app navigate back to the original data page?
  - Create submittable data out of form entries
* The app does routing, sequencing, submitting, and validating the submittable data using a JSON Schema if they desire; the starter app can do all this as an example choosing common dependencies

#### Pros

* App can choose any router or state management
* Form widgets, validation, and "page" display logic can be used independently
* Server-specific things like data submission, file upload, or progress no longer in library
* App can choose different JSON validators for the submittable data based on need

#### Cons

* Significant changes required to bring vets.gov to new version


## Issue: Submit data differs from UI data (e.g., date formats, conditional elements)
## Issue: Data is immediately cleared from elements that are hidden (OPEN)

### Current solutions

* Keep separate `formData` that reflects schema, synced with React/Redux state
* Validate `formData` against schema on form changes
* Immediately clear non-applicable data in `formData` so schema validates
* Use `formData`, not React data, to make logic decisions (e.g. display)
* Use `uiSchema` `view:` to define elements that are not in the schema
* Strip out and/or ignore non-schema elements via special-case code in USFS
* Provide a final opportunity to change data via `transformForSubmit()`

#### Pros

* No duplication of front/back-end needs in the *schema*, for example constraints
* It's what the code does today (few changes needed)
* Already have a site where it works (vets.gov)

#### Cons

* Existence of `schema` and `uiSchema` is confusing
  - Duplication of *names and properties* in the `formConfig`
  - Visual separation of related items (e.g. constraints and error messages)
* Common cases ("Hide these fields if this box is checked") are messy to express
* Two "sources of truth" for the UI state--React data, or `formData`?
  - React is moving to async rendering, how does this affect data syncing?

### Alternatives

* Define the form using a UI-specific data structure (*not* the output schema)
* Keep separate `localData` which is exactly the React state for the form
* Use `localData` to make logic decisions (e.g. display)
* Provide a `transformForSubmit()` to create the output (submitted) data
* Only validate against the output schema after the final step

#### Pros

* All UI-specific config is in one place, easier to define the form
*

#### Cons

* The back-end schema used only at the end, dev bugs may cause a mismatch
* Significant changes required to bring vets.gov to new version
*

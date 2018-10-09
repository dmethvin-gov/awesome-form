

const formConfig = {
  title: 'Kitchen Sink demo for US Forms System',
  subTitle: 'Form USFS-KS1',

  formId: '',
  urlPrefix: '/',
  trackingPrefix: '',

  transformForSubmit: '',
  submitUrl: '',
  consoleSubmit: true,

  confirmation: null,
  footer: null,

  // References these definitions in a `schema` using '#/ref:'
  defaultDefinitions: {
  },

  chapters: {
    firstSection: {
      title: 'Name and Contact Information',
      pages: {
        firstPage: {
          path: 'contact/name-and-email',
          title: 'Name and Email',
          schema: {
            fullName: {
              type: 'object',
              properties: {
                first: { type: 'string', maxLength: 30 },
                middle: { type: 'string', maxLength: 30 },
                last: { type: 'string', maxLength: 30 },
                suffix: {
                  type: 'string',
                  'enum': [ 'Jr.', 'Sr.', 'II', 'III', 'IV' ]
                },
              },
              required: [ 'first', 'last' ]
            },
            email: {
              type: 'string',
              pattern: '.*@.*',
              minlength: 7,
              maxlength: 30
            },
            required: [ 'fullName', 'email' ]
          },
          uiSchema: {
            first: { 'ui:title': 'First name' },
            last: { 'ui:title': 'Last name' },
            middle: { 'ui:title': 'Middle name' },
            suffix: {
              'ui:title': 'Suffix',
              'ui:options': {
                widgetClassNames: 'form-select-medium'
              }
            },
            email: { 'ui:title': 'Email' }
          }
        },
        secondPage: {
          path: 'contact/mailing-address',
          title: 'Mailing Address',
          schema: {
            type: 'object',
            properties: {}
          }
        }
      }
    },
    secondSection: {
      title: 'Second Section',
      pages: {

      }
    }
  }
};

export default formConfig;

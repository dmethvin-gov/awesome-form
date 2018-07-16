import Introduction from '../components/Introduction.jsx';

const formConfig = {
  title: 'Kitchen Sink demo for US Forms System',
  subTitle: 'Form USFS-KS1',

  formId: '',
  urlPrefix: '/',
  trackingPrefix: '',

  transformForSubmit: '',
  submitUrl: '',
  consoleSubmit: true,

  introduction: Introduction,
  confirmation: '',
  footer: '',

  // References these definitions in a `schema` using '#/ref:'
  defaultDefinitions: {
  },

  chapters: {
    firstSection: {
      title: 'Name and Contact Information',
      pages: {
        contactName: {
          path: 'contact/yourname',
          title: 'Your Name',
          schema: {
            type: 'object',
            properties: {
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
              phone: {
                type: 'string',
                pattern: '^[\\d.-()\\s]+$',
                minLength: 10,
                maxLength: 20
              }
            },
            required: [ 'fullName' ]
          },
          uiSchema: {
            fullName: {
              first: { 'ui:title': 'First name' },
              last: { 'ui:title': 'Last name' },
              middle: { 'ui:title': 'Middle name' },
              suffix: {
                'ui:title': 'Suffix',
                'ui:options': {
                  widgetClassNames: 'form-select-medium'
                }
              }
            },
            phone: {
              'ui:title': 'Phone',
              'ui:errorMessages': {
                pattern: 'Please enter a valid phone number'
              }
            }
          }
        },
        contactSocial: {
          path: 'contact/socialinfo',
          title: 'Social Information',
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                pattern: '.*@.*',
                minLength: 7,
                maxLength: 30
              },
              github: {
                type: 'string'
              },
              twitter: {
                type: 'string'
              }
            },
            required: [ 'email' ]
          },
          uiSchema: {
            email: {
              'ui:title': 'Email',
              'ui:errorMessages': {
                pattern: 'Please enter a valid email address'
              }
            },
            github: { 'ui:title': 'Github' },
            twitter: { 'ui:title': 'Twitter'}
          }
        }
      }
    },
    secondSection: {
      title: 'Mailing Address',
      pages: {
        mailAddress: {
          path: 'contact/mailing-address',
          title: 'Address, City, and State',
          schema: {
            type: 'object',
            required: [ 'addr1', 'city', 'state', 'zip' ],
            properties: {
              addr1: { type: 'string', maxLength: 50 },
              addr2: { type: 'string', maxLength: 50 },
              city: { type: 'string', maxLength: 50 },
              state: {
                type: 'string',
                maxLength: 2,
                'enum': [
                  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
                  'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
                  'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
                  'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP',
                  'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
                  'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
                 ]
              },
              zip: { type: 'string', maxLength: 10 },
            }
          },
          uiSchema: {
            addr1: { 'ui:title': 'Address Line 1' },
            addr2: { 'ui:title': 'Address Line 2' },
            city: { 'ui:title': 'City' },
            state: { 'ui:title': 'State' },
            Zip: { 'ui:title': 'Zip' }
          }
        }
      }
    }
  }
};

export default formConfig;

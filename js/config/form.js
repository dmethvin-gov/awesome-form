import Introduction from '../components/Introduction.jsx';

import CurrencyWidgetUI from 'us-forms-system/lib/js/definitions/currency';
import CurrentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

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

    TESTSECTION: {
      title: 'I am a test section',
      pages: {
        SPECIAL: {
          path: 'financial/BORKEN',
          title: 'Monthly Income Sources',
          schema: {
            type: 'object',
            required: [  ],
            properties: {
              employed: { type: 'boolean' },
              jobStartDate: { type: 'string' },
              monthlyWages: { type: 'string' },
              jobCount: { type: 'number' },
              otherMonthlyIncome: { type: 'string' }
            }
          },
          uiSchema: {
            employed: { 'ui:title': 'I am employed' },
            monthlyWages: CurrencyWidgetUI('Monthly wages'),
            jobCount: { 'ui:title': 'Number of jobs' },
            jobStartDate: CurrentOrPastDateUI('Job start date'),
            otherMonthlyIncome: CurrencyWidgetUI('Other monthly income')
          }
        }
      }
    },

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
                pattern: '^[\\d.()\\s-]+$',
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
              newsletter: { type: 'boolean' },
              twitter: { type: 'string' },
              facebook: { type: 'string' }
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
            newsletter: { 'ui:title': 'Subscribe to the weekly newsletter' },
            twitter: { 'ui:title': 'Twitter' },
            facebook: { 'ui:title': 'Facebook' }
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
            zip: { 'ui:title': 'Zip' }
          }
        }
      }
    },
    thirdSection: {
      title: 'Financial Information',
      pages: {
        incomeSources: {
          path: 'financial/income',
          title: 'Monthly Income Sources',
          schema: {
            type: 'object',
            required: [ 'income' ],
            properties: {
              monthlyWages: { type: 'string' },
              jobCount: { type: 'number' },
              otherIncome: { type: 'string' }
            }
          },
          uiSchema: {
            monthlyWages: CurrencyWidgetUI('Monthly wages'),
            jobCount: { 'ui:title': 'Number of jobs' },
            otherIncome: CurrencyWidgetUI('Other monthly income')
          }
        }
      }
    }
  }
};

export default formConfig;

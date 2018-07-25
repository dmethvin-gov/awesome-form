import Introduction from '../components/Introduction.jsx';

import CurrencyWidgetUI from 'us-forms-system/lib/js/definitions/currency';
import CurrentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';
import { uiSchema as autosuggestUI } from 'us-forms-system/lib/js/definitions/autosuggest';

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
          path: 'test',
          title: 'Test of initialData',
          initialData: {
            simple: 'initial data'
          },
          schema: {
            type: 'object',
            properties: {
              officeLocation: {
                type: 'string',
                enum: [
                  'LA', 'NY', 'CH'
                ],
                enumNames: [
                  'Los Angeles',
                  'New York',
                  'Chicago'
                ]
              }
            }
          },
          uiSchema: {
            officeLocation: autosuggestUI(
              'Preferred Office Location',  // field title
              null,         // Promise to get options (optional)
              {             // Additional uiSchema options
                'ui:options': {
                  labels: { }
                }
              }
            )
          }
        }
      }
    }
  }
};

export default formConfig;

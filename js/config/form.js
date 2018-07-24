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
          path: 'test',
          title: 'Test of initialData',
          initialData: {
            simple: 'initial data'
          },
          schema: {
            type: 'object',
            properties: {
              simple: { type: 'string' }
            }
          },
          uiSchema: {
          }
        }
      }
    }
  }
};

export default formConfig;

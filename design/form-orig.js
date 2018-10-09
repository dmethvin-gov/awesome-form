
// React components for parts of the page
import Introduction from '../components/Introduction.jsx';
// import Confirmation from '../components/Confirmation.jsx';
// import Footer from from '../components/Footer.jsx';

// Form definitions
import fullName from '../definitions/fullName';
import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';

const formConfig = {
  title: 'Kitchen Sink demo for US Forms System',
  subTitle: 'Form USFS-KS1',

  formId: '',
  urlPrefix: '/',
  trackingPrefix: 'form-',

  transformForSubmit: '',
  submitUrl: '',
  consoleSubmit: true,

  introduction: Introduction,
  confirmation: null,
  footer: null,

  defaultDefinitions: {
    fullName
  },

  chapters: {
    firstSection: {
      title: 'First Section',
      pages: {
        firstPage: {
          path: 'first-section/first-page',
          title: 'First Page',
          schema: {
            type: 'object',
            properties: {
              fullName
            },
            uiSchema: {
              fullName: fullNameUI
            }
          }
        },
        secondPage: {
          path: 'first-section/second-page',
          title: 'Second Page',
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

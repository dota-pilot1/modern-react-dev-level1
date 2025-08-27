import IBSheetLoader from '@ibsheet/loader';

let configured = false;

export function ensureIBSheetConfigured() {
  if (configured) return IBSheetLoader;
  IBSheetLoader.config({
    registry: [{
      name: 'ibsheet',
      baseUrl: 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet/'
    }]
  });
  IBSheetLoader.load();
  configured = true;
  return IBSheetLoader;
}

export default IBSheetLoader;

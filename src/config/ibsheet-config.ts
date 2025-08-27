import IBSheetLoader from '@ibsheet/loader';

const ibsheetLib = {
  name: 'ibsheet',
  baseUrl: 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet/',
  locales: ['en', 'ko'],
  theme: 'material',
  plugins: ['excel', 'common', 'dialog'],
  license: ''
};

IBSheetLoader.config({ registry: [ibsheetLib] });
IBSheetLoader.load();

IBSheetLoader.once('loaded', (evt: any) => {
  if (evt.target?.alias === ibsheetLib.name) {
    console.log('[IBSheetLoader] core loaded');
  }
});

export default IBSheetLoader;

const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const instance = axios.create({
  timeout: 600000,
});

let csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'EmployerName', title: 'EmployerName'},
    {id: 'Oib', title: 'Oib'},
    {id: 'SupportedEmployeeNumber', title: 'SupportedEmployeeNumber'},
    {id: 'SupportPaidAmount', title: 'SupportPaidAmount'},
  ]
});
let pages = [...Array(84).keys()].map(x => ++x)
function call(i) {
  instance.post('https://mjera-orm.hzz.hr/api/GetCompanyPaymentData', {
    month: 3,
    pageIndex: i,
    pageSize: 1000
  })
  .then((res) => {
    if (res.data.Data.length) {
      csvWriter
      .writeRecords(res.data.Data).then(() => {
        console.log(i + ' done');
        if (pages.length)
          call(pages.shift());
      })
    }
    else {
      call(i);
    }
  })
  .catch(() => {
    call(i);
  })
}

call(pages.shift());
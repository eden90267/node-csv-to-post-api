const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('fast-csv');
const fs = require("fs");

const convertCSVToJSON = require("../modules/convert").convertCSVToJSON;

const upload = multer({
  dest: 'uploads/'
});

/* GET home page. */
router.get('/', function (req, res, next) {
  const messages = req.flash('error');
  const data = JSON.stringify(req.flash('data')[0]) || "{}";
  res.render('index', {
    title: 'CSV to POST API',
    messages,
    data
  });
});

router.post('/upload', upload.single('csvdata'), function (req, res, next) {
  let fileRows = [];
  if (req.file) {
    csv.fromPath(req.file.path)
      .on("data", function (data) {
        fileRows.push(data);
      })
      .on("end", function () {
        fs.unlinkSync(req.file.path); // remove temp file
        req.flash('data', convertCSVToJSON(fileRows));
        res.redirect('/');
      });
  } else {
    req.flash('error', '未上傳任何 .csv 檔案');
    res.redirect('/');
  }
});

router.post('/post-data', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  req.session.data = JSON.parse(req.body.data || {});
  res.redirect('/download');
});

router.get('/download', function (req, res, next) {
  const data = req.session.data || {};
  res.setHeader('Content-disposition', 'attachment; filename=result' + new Date().getTime() + '.csv');
  res.setHeader('content-type', 'text/csv');
  let csvStream = csv.createWriteStream({headers: true, objectMode: true});
  csvStream.pipe(res);
  for (let item in data.sendData) {
    csvStream.write({
      Url: data.url,
      SMSMessage: data.SMSMessage,
      IMMessage: data.IMMessage,
      'No.': data.sendData[item].no,
      RecipientPhone: data.sendData[item].recipientPhone,
      TicketNo: data.sendData[item].ticketNo,
      status: data.sendData[item].status,
      SMSS: data.sendData[item].SMSS,
      SRMsg: data.sendData[item].SRMsg,
      error: data.sendData[item].error
    });
  }
  csvStream.end();
  req.session.data = {};
});

module.exports = router;

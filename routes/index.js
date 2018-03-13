const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('fast-csv');
const fs = require("fs");

const upload = multer({
  dest: 'uploads/'
});

/* GET home page. */
router.get('/', function(req, res, next) {
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

function convertCSVToJSON(fileRows) {
  console.log(fileRows);
  let serverIP = fileRows[0][1].trim();
  let SMSMessage = fileRows[1][1].trim();
  let IMMessage = fileRows[2][1].trim();
  let sendData = [];
  for (let i = 6; i < fileRows.length; i++) {
    sendData.push({
      no: Number.parseInt(fileRows[i][0].trim()),
      recipientPhone: fileRows[i][1].trim(),
      ticketNo: Number.parseInt(fileRows[i][2].trim())
    });
  }
  let result = {
    serverIP,
    SMSMessage,
    IMMessage,
    sendData
  };
  console.log(result);
  return result;
}

module.exports = router;

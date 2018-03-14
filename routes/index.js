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

module.exports = router;

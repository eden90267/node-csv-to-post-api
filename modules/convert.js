function convertCSVToJSON(fileRows) {
  console.log(fileRows);
  let serverIP = fileRows[0][1].trim();
  let SMSMessage = fileRows[1][1].trim();
  let IMMessage = fileRows[2][1].trim();
  let sendData = [];
  for (let i = 6; i < fileRows.length; i++) {
    if (fileRows[i][0] !== '' && fileRows[i][1] !== '' && fileRows[i][2] !== '') {
      sendData.push({
        no: Number.parseInt(fileRows[i][0].trim()),
        recipientPhone: fileRows[i][1].trim(),
        ticketNo: Number.parseInt(fileRows[i][2].trim())
      });
    }
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

module.exports = {
  convertCSVToJSON
};
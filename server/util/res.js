
const moment = require("moment");
const error500 = (res) => {
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
};

const error400 = (res, msg) => {
  return res.status(400).json({ success: false, message: msg });
};
const error401 = (res) => {
  return res
    .status(401)
    .json({ success: false, message: "Access token not found" });
};

const error403 = (res) => {
  return res.status(401).json({ success: false, message: "Invalid Token" });
};

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const sendEmail = (code,email) => {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  let Email = {
    send: function (a) {
      return new Promise(function (n, e) {
        (a.nocache = Math.floor(1e6 * Math.random() + 1)),
          (a.Action = "Send");
        var t = JSON.stringify(a);
        Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
          n(e);
        });
      });
    },
    ajaxPost: function (e, n, t) {
      var a = Email.createCORSRequest("POST", e);
      a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        (a.onload = function () {
          var e = a.responseText;
          null != t && t(e);
        }),
        a.send(n);
    },
    ajax: function (e, n) {
      var t = Email.createCORSRequest("GET", e);
      (t.onload = function () {
        var e = t.responseText;
        null != n && n(e);
      }),
        t.send();
    },
    createCORSRequest: function (e, n) {
      var t = new XMLHttpRequest();
      return (
        "withCredentials" in t
          ? t.open(e, n, !0)
          : "undefined" != typeof XDomainRequest
          ? (t = new XDomainRequest()).open(e, n)
          : (t = null),
        t
      );
    },
  };
 
  Email.send({
    Host :"smtp.elasticemail.com",
    Username : "sdkansdkan123@gmail.com",
    Password : "8486B07F6053E030F5C1614CC9518A562AAF",
    To: email,
    From: "sdkansdkan123@gmail.com",
    Subject: "Verification code",
    Body:
      `<div style="padding:0 30px;background:#fff">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <body>
        <tr>
          <td style="border-bottom:1px solid #e6e6e6;font-size:18px;padding:20px 0">
            <table
              border="0"
              cellspacing="0"
              cellpadding="0"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>Change password verification</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size:14px;line-height:30px;padding:20px 0 0;color:#666">
            Hello, You attempted to change your password.
            Please note: Your code will expire in 30 minutes.
          </td>
        </tr>
        <tr>
          <td style="font-size:14px;line-height:30px;padding:0 0 20px;color:#666">
            Verification code:
          </td>
        </tr>
        <tr>
          <td>
            <span style="padding:5px 0;font-size:20px;font-weight:bolder;color:#e9b434">
             ` +
             code +
      `
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 0 10px 0;line-height:26px;color:#666">
            Please do not share this code with anyone.If you did not
            initiate this operation
          </td>
        </tr>
      </body>
    </table>
  </div>
`,
    
  }).then((message) =>{ console.log(message)});
};

const getDataChartUserDay = (startDay, endDay) => {
  let newDay = moment(startDay);
  let listDays = [startDay];
  let count = 0;
  while (!moment(newDay).isSame(endDay, "day")) {
    newDay = moment(newDay).add(1, "days");
    listDays.push(newDay);
    count++;
  }
  // console.log(listDays);
  return listDays;
};

const getDataChartUserMonth = (startDay, endDay) => {
  let newDay = moment(startDay);
  let listDays = [startDay];
  let count = 0;
  while (!moment(newDay).isSame(endDay, "month")) {
    newDay = moment(newDay).add(1, "months").startOf("month");
    listDays.push(newDay);
    count++;
  }
  // console.log(listDays);
  return listDays;
};

const getDataChartUserYear = (startDay, endDay) => {
  let newDay = moment(startDay);
  let listDays = [startDay];
  let count = 0;
  while (!moment(newDay).isSame(endDay, "year")) {
    newDay = moment(newDay).add(1, "years").startOf("year");
    listDays.push(newDay);
    count++;
  }
  // console.log(listDays);
  return listDays;
};

module.exports = {
  error500,
  error400,
  error401,
  error403,
  makeid,
  sendEmail,
  getDataChartUserDay,
  getDataChartUserMonth,
  getDataChartUserYear
};

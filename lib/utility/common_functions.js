const Chance = require("chance");
const mongoose = require("mongoose");
const randomNumber = require("random-number");
const nodemailer = require("nodemailer");
const request = require("request");
const { WebClient } = require("@slack/web-api");
const util_keys = require("./util_keys");
let AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: util_keys.AWS_ACCESS_KEY,
  secretAccessKey: util_keys.AWS_SECRET_KEY,
  region: util_keys.aws_region
});
const moment = require('moment');
const util_key = require('./util_keys');

const {
  UNIFONIC_APP_SID,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  SENDGRID_API_KEY,
  EMAIL_SENDER_ADDRESS,
  SLACK_AUTH_TOKEN,
} = require("./util_keys");

// const jwt = require('jsonwebtoken');
exports.toObjectId = (string) => {
  return mongoose.Types.ObjectId(string);
};

exports.generateRandomNumber = (length) => {
  const max = 100000000;
  const min = 100;
  const randomNo = Math.floor(Math.random() * (max - min + 1) + min);
  const chance = new Chance(Date.now() + randomNo);
  const randomStr = chance.string({
    length,
    pool: "abcdefghijklmnopqrstuvwxyz0123456789@",
  });
  return randomStr;
};

exports.getFourDigitOTP = () => {
  if (util_key.APP_STATE == 'production') {
    const options = {
      min: 1000,
      max: 9999,
      integer: true,
    };
    return randomNumber(options);
  } else {
    return 1234;
  }
};

// // JWT Token
// exports.generateJWTToken = (data) => {
//     const token = jwt.sign(data, JWT_SECRET_KEY);
//     return token;
// };

exports.timestampNow = () => new Date().getTime();

exports.timestampNow_in_current = () => {
  let d_t = new Date();
  return (
    d_t.getDate() +
    "-" +
    (d_t.getMonth() + 1) +
    "-" +
    d_t.getFullYear() +
    " " +
    d_t.getHours() +
    ":" +
    d_t.getMinutes() +
    ":" +
    d_t.getMilliseconds()
  );
};

exports.getSecondsDifference = (date1, date2) => {
  const seconds = (date2 - date1) / 1000;
  return seconds;
};

exports.checkSMSResponse = (response /* , body */) =>
  response.statusCode === 200 || response.statusCode === 201;

exports.send_message = (mobileNumber, text, callback) => {
  const mobileNo = mobileNumber;
  // console.log('sendMessage ', text, mobileNumber);
  const data = `AppSid=${UNIFONIC_APP_SID}&Recipient=${mobileNo}&Body=${text}`;
  // console.log(data);
  request(
    {
      method: "POST",
      url: "http://api.unifonic.com/rest/Messages/Send",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    },
    (error, response, body) => {
      console.log('Status:', response.statusCode);
      console.log('Headers:', JSON.stringify(response.headers));
      console.log('Response:', body);
      console.log('message sending error', error);
      if (!error) {
        console.log(`Error in sending message${mobileNo}`, text);
      }
      // console.log(response);
      // return response;
      if (callback != null) {
        callback(error, response, body);
      }
    }
  );
};

exports.send_mail = async (options, callback) => {
  this.send_emails_to_slack(options);
  // send mail to admin for reviewing the artist
  // nodemailer.setApiKey(SENDGRID_API_KEY)
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  transporter.sendMail(options, (error) => {
    if (error) console.log("error ", error)
    callback(error);
  });
};

exports.sending_mail = async (options, callback) => {
  const mailOptions = {
    from: EMAIL_SENDER_ADDRESS,
    to: options.to,
    subject: options.subject,
    html: options.messages,
  };
  this.send_emails_to_slack(mailOptions);
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (error) => {
    if (error) console.log("error ", error)
    callback(error);
  });
};

exports.check_value_or_null = (obj, key) => {
  return key.split(".").reduce(function (o, x) {
    return typeof o == "undefined" || o === null ? o : o[x];
  }, obj);
};

exports.check_value_null = (obj, objs) => {
  // console.log(objs);
  let dd = objs || "";
  let sp = objs.split(".");
  // let obj = sp[0];
  let key = dd.substring(sp[0].length + 1, dd.length);
  return key.split(".").reduce(function (o, x) {
    // console.log(o[x]);
    let ret = typeof o == "undefined" || o === null ? o : o[x];
    // console.log(ret);
    return ret;
  }, obj);
};

exports.show_null_empty_Undefined = (obj) => {
  // console.log(obj);
  if (
    obj === "" ||
    obj === undefined ||
    obj === "undefined" ||
    obj === "null"
  ) {
    return null;
  }
  return obj;
};

// check objects and show null if needed
exports.check_objects_show_null = (obj) => {
  const newObj = {};
  // console.log(obj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // console.log(key, " -> ", obj[key], typeof obj[key]);
      const objValue = obj[key];
      if (
        objValue === "" ||
        objValue === undefined ||
        objValue === "undefined" ||
        objValue === "null"
      ) {
        newObj[key] = null;
      } else {
        newObj[key] = objValue;
      }
    }
  }
  return newObj;
};

// send OTP to slack channel
exports.send_otp_to_slack = async (data) => {
  // Create a new instance of the WebClient class with the token read from your environment variable
  let slack_channel = "digischeduleotp";
  slack_channel = (util_key.APP_STATE == 'production') ? "prod-digischeduler" : "digischeduleotp"
  const web = new WebClient(SLACK_AUTH_TOKEN);
  try {
    await web.chat.postMessage({
      channel: slack_channel,
      text: data,
    });
    // console.log('Sent to slack channel', r);
    return true;
  } catch (e) {
    console.log("Error in sending to slack channel", e);
    throw Error(e);
  }
};

// send EMAIL to slack channel
exports.send_emails_to_slack = async (data) => {
  // Create a new instance of the WebClient class with the token read from your environment variable
  let slack_channel = "digischeduleotp";
  slack_channel = (util_key.APP_STATE == 'production') ? "prod-digischeduler" : "digischeduleotp"
  const web = new WebClient(SLACK_AUTH_TOKEN);
  try {
    await web.chat.postMessage({
      channel: slack_channel,
      text: data,
    });
    // console.log('Sent to slack channel', r);
    return true;
  } catch (e) {
    console.log("Error in sending to slack channel", e);
    throw Error(e);
  }
};

let pinpoint = new AWS.Pinpoint();
// send EMAIL using Pinpoint
exports.send_email = async (to_address, subject, data) => {
  const mailOptions = {
    to: to_address,
    subject: subject,
    html: data,
  };
  this.send_emails_to_slack({ area: util_key.APP_STATE, data: mailOptions });

  let body_html = `<html><head></head><body>${data}</body></html>`;
  let charset = util_keys.AWS_CHARSET;
  let params = {
    ApplicationId: util_keys.AWS_APP_ID,
    MessageRequest: {
      Addresses: {
        [to_address]: {
          ChannelType: 'EMAIL'
        }
      },
      MessageConfiguration: {
        EmailMessage: {
          FromAddress: util_keys.SENDER_ADDRESS,
          SimpleEmail: {
            Subject: {
              Charset: charset,
              Data: subject
            },
            HtmlPart: {
              Charset: charset,
              Data: body_html
            }
          }
        }
      }
    }
  };
  // pinpoint.sendMessages(params, function (err, data) {
  //   if (err) {
  //     console.log(err.message);
  //   } else {
  //     console.log("Email sent!");
  //   }
  // });
};

// send SMS using Pinpoint
exports.send_sms = async (to_mobiles, data) => {
  this.send_emails_to_slack({ area: util_key.APP_STATE, mode: 'SMS', to: to_mobiles, data });
  if (util_key.APP_STATE == 'production') {
    request(
      {
        method: "GET",
        url: `http://www.OurSms.net/api/sendsms.php?username=${util_keys.SMS_USERNAME}&password=${util_keys.SMS_PASSWORD}&message=${data}&numbers=${to_mobiles}&sender=${util_keys.SMS_SENDER}&return=${util_keys.SMS_RETURN}`
      },
      (error, response, body) => {
        if (error) {
          console.log(`Error in sending message ${to_mobiles} ` + error);
        } else {
          console.log('Response: ', body);
        }
      }
    );
  } else {
    var params = {
      ApplicationId: util_keys.AWS_APP_ID,
      MessageRequest: {
        Addresses: {
          [to_mobiles]: {
            ChannelType: 'SMS'
          }
        },
        MessageConfiguration: {
          SMSMessage: {
            Body: data,
            MessageType: "TRANSACTIONAL",
            SenderId: util_keys.AWS_SENDER_ID,
          }
        }
      }
    };
    // pinpoint.sendMessages(params, function (err, data) {
    //   if (err) {
    //     console.log(err.message);
    //   } else {
    //     console.log("Message sent!");
    //   }
    // });
  }
};

/*
// send SMS using Pinpoint
exports.send_sms = async (to_mobiles, data) => {

  this.send_emails_to_slack({ mode: 'SMS', to: to_mobiles, data });
  var params = {
    ApplicationId: util_keys.AWS_APP_ID,
    MessageRequest: {
      Addresses: {
        [to_mobiles]: {
          ChannelType: 'SMS'
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: data,
          MessageType: "TRANSACTIONAL",
          SenderId: util_keys.AWS_SENDER_ID,
        }
      }
    }
  };
  pinpoint.sendMessages(params, function (err, data) {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Message sent!");
    }
  });
}; */
// };
//

const getDateTimeToTime = function (dateTime) {
  var dt = new Date(dateTime);
  dt = moment(dt).format("hh:mm A");
  return dt;
}

const getTimeStampNew = function (date, time) {
  var dat = date.split("-");
  let day = dat[2];
  let month = dat[1];
  let year = dat[0];
  let t = time.split(":");
  let hour = t[0];
  let minAm = t[1].split(" ");
  let mins = minAm[0];
  let am = minAm[1];
  if (am != "AM" && parseInt(hour) != 12) {
    hour = parseInt(hour) + 12;
  }
  return new Date(year, month, day, hour, mins).getTime();
}

const getLocalTime = function (timestamp) {
  ;
  var date = new Date(timestamp)
  return moment(date).format('YYYY-MM-DD hh:mm:ss A');
  //return new Date(timestamp).toLocaleString();
}

/////////////////Split data individual dated data from range dates and normal date/////////////

const splitIndividualFromRange = function (fetchedData, settingsCollegeTime) {
  //var sDate = moment(end_date);
  //var eDate = moment(end_date);
  var bookedDateandTimingsArr = [];
  var dateArr = [];
  for (let i = 0; i < fetchedData.length; i++) {
    var sDate = moment(fetchedData[i]["start_date"]);
    var eDate = moment(fetchedData[i]["end_date"]);
    var j = 0;
    for (var m = moment(sDate); m.diff(eDate, 'days') <= 0; m.add(1, 'days')) {
      var sTime, eTime = 0;
      if (j != 0)
        sTime = settingsCollegeTime[0];
      else
        sTime = fetchedData[i]["start_time"]

      if (m.diff(eDate, 'days') != 0)
        eTime = settingsCollegeTime[1];
      else
        eTime = fetchedData[i]["end_time"]


      bookedDateandTimingsArr.push([{ "date": m.format('YYYY-MM-DD'), "start_time": sTime, end_time: eTime }]);
      dateArr.push(m.format('YYYY-MM-DD'));
      j++;
    }
  }
  return { "dateArr": dateArr, "bookedDateandTimingsArr": bookedDateandTimingsArr };
}
/////////////////Split data individual dated data from range dates and normal date end/////////////
/////////////////////////////////////////////////////////////////////
const searchInArray = function (newDateArr, date) {
  var flag = 0;
  var arr = [];
  var index = null;
  for (let i = 0; i < newDateArr.length; i++) {
    if (newDateArr[i] == date) {
      flag = 1;
      index = i;
      break;
    }
  }
  if (flag == 1) {
    arr.push({ "index": index, "flag": flag });
    return arr;
  }
  else {
    arr.push({ "index": index, "flag": flag });
    return arr;
  }
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////Grouping duplicate date/////////////////////////

exports.groupDuplicateDate = function (dateArr, bookedDateandTimingsArr) {
  var newDateArr = [];
  var newBookedDateandTimingsArr = [];
  for (let i = 0; i < dateArr.length; i++) {
    var arr = searchInArray(newDateArr, dateArr[i]);
    if (arr[0]["flag"] == 1) {
      for (let k = 0; k < bookedDateandTimingsArr[i].length; k++) {
        newBookedDateandTimingsArr[arr[0]["index"]].push(bookedDateandTimingsArr[i][k])
      }
    }
    else {
      newDateArr.push(dateArr[i]);
      newBookedDateandTimingsArr.push(bookedDateandTimingsArr[i])
    }
  }
  return { "newDateArr": newDateArr, "newBookedDateandTimingsArr": newBookedDateandTimingsArr }
}
const groupDuplicateDate = function (dateArr, bookedDateandTimingsArr) {
  var newDateArr = [];
  var newBookedDateandTimingsArr = [];
  for (let i = 0; i < dateArr.length; i++) {
    var arr = searchInArray(newDateArr, dateArr[i]);
    if (arr[0]["flag"] == 1) {
      for (let k = 0; k < bookedDateandTimingsArr[i].length; k++) {
        newBookedDateandTimingsArr[arr[0]["index"]].push(bookedDateandTimingsArr[i][k])
      }
    }
    else {
      newDateArr.push(dateArr[i]);
      newBookedDateandTimingsArr.push(bookedDateandTimingsArr[i])
    }
  }
  return { "newDateArr": newDateArr, "newBookedDateandTimingsArr": newBookedDateandTimingsArr }
}
///////////////////////Grouping duplicate date ENd/////////////////////////
///////////////////////Sort Booked Timing//////////////////////////////////////////////
exports.sortBookedTime = function (date, timings) {
  var temp = "";
  for (var i = 0; i < timings.length; i++) {
    for (var j = 0; j < timings.length - i - 1; j++) {
      var timestamp1 = getTimeStampNew(date, timings[j].start_time);
      var timestamp2 = getTimeStampNew(date, timings[j + 1].start_time);
      if (timestamp1 > timestamp2) {
        temp = timings[j];
        timings[j] = timings[j + 1];
        timings[j + 1] = temp;
      }
    }
  }
  return timings;

}

const sortBookedTime = function (date, timings) {
  var temp = "";
  for (var i = 0; i < timings.length; i++) {
    for (var j = 0; j < timings.length - i - 1; j++) {
      var timestamp1 = getTimeStampNew(date, timings[j].start_time);
      var timestamp2 = getTimeStampNew(date, timings[j + 1].start_time);
      if (timestamp1 > timestamp2) {
        temp = timings[j];
        timings[j] = timings[j + 1];
        timings[j + 1] = temp;
      }
    }
  }
  return timings;

}
/////////////////////////Sort Booked Timing End/////////////////////
////////////////////////////Get Available Timings///////////////////////////////////////////////////
exports.getAvailableTimings = function (date, bookedTimings, settingsCollegeTimings = ["10:00 AM", "3:30 PM"]) {
  let collegeStartTime = getTimeStampNew(date, settingsCollegeTimings[0]);
  let collegeEndTime = getTimeStampNew(date, settingsCollegeTimings[1]);
  let availableTimingsArr = [];
  let prevTime = 0;
  for (let i = 0; i < bookedTimings.length; i++) {
    if (i == 0)
      prevTime = collegeStartTime;
    else
      prevTime = getTimeStampNew(date, bookedTimings[i - 1]["end_time"]);

    if (prevTime < getTimeStampNew(date, bookedTimings[i]["start_time"]))
      availableTimingsArr.push(getLocalTime(prevTime) + " - " + getLocalTime(getTimeStampNew(date, bookedTimings[i]["start_time"])))

    if (i == bookedTimings.length - 1) {
      var bETime = getTimeStampNew(date, bookedTimings[i]["end_time"]);
      if (bETime < collegeEndTime)
        availableTimingsArr.push(getLocalTime(bETime) + " - " + getLocalTime(collegeEndTime));
    }
  }
  return availableTimingsArr
}

const getAvailableTimings = function (date, bookedTimings, settingsCollegeTimings = ["10:00 AM", "3:30 PM"]) {
  let collegeStartTime = getTimeStampNew(date, settingsCollegeTimings[0]);
  let collegeEndTime = getTimeStampNew(date, settingsCollegeTimings[1]);
  let availableTimingsArr = [];
  let prevTime = 0;
  for (let i = 0; i < bookedTimings.length; i++) {
    if (i == 0)
      prevTime = collegeStartTime;
    else
      prevTime = getTimeStampNew(date, bookedTimings[i - 1]["end_time"]);

    if (prevTime < getTimeStampNew(date, bookedTimings[i]["start_time"]))
      availableTimingsArr.push(getLocalTime(prevTime) + " - " + getLocalTime(getTimeStampNew(date, bookedTimings[i]["start_time"])))

    if (i == bookedTimings.length - 1) {
      var bETime = getTimeStampNew(date, bookedTimings[i]["end_time"]);
      if (bETime < collegeEndTime)
        availableTimingsArr.push(getLocalTime(bETime) + " - " + getLocalTime(collegeEndTime));
    }
  }
  return availableTimingsArr
}
////////////////////////////Get Available Timings End/////////////////////////////////////////
//////////////////////////////////Split User Given Range DAte//////////////////////////

exports.splitIndividualFromRangeUserDate = function (userGivenDates, settingsCollegeTime) {
  //var sDate = moment(end_date);
  //var eDate = moment(end_date);
  var splitedDate = [];
  var dateArr = [];
  for (let i = 0; i < userGivenDates.length; i++) {
    var sDate = moment(userGivenDates[i]["start_date"]);
    var eDate = moment(userGivenDates[i]["end_date"]);
    var j = 0;
    for (var m = moment(sDate); m.diff(eDate, 'days') <= 0; m.add(1, 'days')) {
      var sTime, eTime = 0;
      if (j != 0)
        sTime = settingsCollegeTime[0];
      else
        sTime = userGivenDates[i]["start_time"]

      if (m.diff(eDate, 'days') != 0)
        eTime = settingsCollegeTime[1];
      else
        eTime = userGivenDates[i]["end_time"]


      splitedDate.push({ "date": m.format('YYYY-MM-DD'), "start_time": sTime, end_time: eTime });
      //dateArr.push(m.format('YYYY-MM-DD'));
      j++;
    }
  }
  return splitedDate;
}
/////////////////Split User Given Range DAte End/////////////
////////////////////////////Fall In Range/////////////////////////////
exports.fallInRange = (splitedDates, fetchedData, settingsCollegeTime) => {
  var splitedIndividualFromRange = splitIndividualFromRange(fetchedData, settingsCollegeTime);
  var { newDateArr, newBookedDateandTimingsArr } = groupDuplicateDate(splitedIndividualFromRange["dateArr"], splitedIndividualFromRange["bookedDateandTimingsArr"])
  //console.log("-----------------------");
  //console.log(splitedIndividualFromRange);
  //console.log(newBookedDateandTimingsArr);

  var sortedBookedTime = [];
  for (let i = 0; i < newBookedDateandTimingsArr.length; i++) {
    var sortedBTimings = sortBookedTime(newBookedDateandTimingsArr[i][0]["date"], newBookedDateandTimingsArr[i]);
    sortedBookedTime.push(sortedBTimings);
  }
  //console.log(sortedBookedTime);


  var flag = 0;
  for (let i = 0; i < splitedDates.length; i++) {//splittedDates
    for (let sbt = 0; sbt < sortedBookedTime.length; sbt++) {//sortedBookedTime outer
      for (sbt2 = 0; sbt2 < sortedBookedTime[sbt].length; sbt2++) {//sortedBookedTime inner
        //console.log(splitedDates[i]["date"] +"=="+ sortedBookedTime[sbt][sbt2]["date"]);
        if (splitedDates[i]["date"] == sortedBookedTime[sbt][sbt2]["date"]) {
          //fall in range check
          var userGivenStartTime = getTimeStampNew(splitedDates[i]["date"], splitedDates[i]["start_time"])
          var userGivenEndTime = getTimeStampNew(splitedDates[i]["date"], splitedDates[i]["end_time"])
          var fetchedBookedStartTime = getTimeStampNew(sortedBookedTime[sbt][sbt2]["date"], sortedBookedTime[sbt][sbt2]["start_time"])
          var fetchedBookedEndTime = getTimeStampNew(sortedBookedTime[sbt][sbt2]["date"], sortedBookedTime[sbt][sbt2]["end_time"])
          /* if((userGivenTime >= fetchedBookedStartTime) && (userGivenTime < fetchedBookedEndTime)){
                //fall in range
                flag = 1;
          } */
          if ((flag == 0) && (userGivenStartTime <= fetchedBookedStartTime) && (userGivenEndTime <= fetchedBookedEndTime))
            flag = 1;
          else if ((flag == 0) && (userGivenStartTime >= fetchedBookedStartTime) && (userGivenEndTime <= fetchedBookedEndTime))
            flag = 1;
          else if ((flag == 0) && (userGivenStartTime <= fetchedBookedStartTime) && (userGivenEndTime >= fetchedBookedEndTime))
            flag = 1;
          else if ((flag == 0) && (userGivenStartTime <= fetchedBookedStartTime) && (userGivenEndTime >= fetchedBookedEndTime))
            flag = 1;

        }
        if (flag == 1)
          break;
      }
      if (flag == 1)
        break;
    }
    if (flag == 1)
      break;

  }
  if (flag == 1)
    console.log("Fall in Range");
  else
    console.log("Not Fall in Range");

  return flag;
}

////////////////////////////Fall In Range End/////////////////////////////
///////////////////////////Get Available Timings///////////////////////////
exports.getAvailableTimingsOnRangeDates = (fetchedData, settingsCollegeTime) => {
  var { dateArr, bookedDateandTimingsArr } = splitIndividualFromRange(fetchedData, settingsCollegeTime);
  var { newDateArr, newBookedDateandTimingsArr } = groupDuplicateDate(dateArr, bookedDateandTimingsArr)
  //Sorting
  var sortedBookedTime = [];
  for (let i = 0; i < newBookedDateandTimingsArr.length; i++) {
    var sortedBTimings = sortBookedTime(newBookedDateandTimingsArr[i][0]["date"], newBookedDateandTimingsArr[i]);
    sortedBookedTime.push(sortedBTimings);
  }
  //////////////////////
  //Get Available Timings
  var aTimingsArr = [];
  for (let i = 0; i < sortedBookedTime.length; i++) {
    var timings = getAvailableTimings(sortedBookedTime[i][0]["date"], sortedBookedTime[i]);
    if (timings != "")
      aTimingsArr.push(timings);
  }
  return aTimingsArr
}

////////////////////////
//////////////////////////Get Available Timings End////////////////////////

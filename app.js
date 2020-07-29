const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const moment = require("moment");
const pool = require('./connect');

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true })); // `true` instead of `false`
app.use(bodyParser.json());


app.get("/token", Token, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

app.post("/register", Token, (req, resp) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  let auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        ShortCode: "600347",
        ResponseType: "Completetransaction",
        ConfirmationURL: "https://bc2ac892b0b0.ngrok.io/confirmation",
        ValidationURL: "https://bc2ac892b0b0.ngrok.io/validation_url",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      }
      resp.status(200).json(body);
    }
  );
});

app.post("/confirmation", (req, res) => {
  console.log("Confirmation");

  console.log(req.body);


  try{

    const author = req.body;
    console.log(author);


    pool.query(
      "INSERT INTO mobile_payments_confirmation (transID,TransactionType ,TransTime ,TransAmount,BusinessShortCode,BillRefNumber,InvoiceNumber ,OrgAccountBalance ,ThirdPartyTransID,MSISDN ,FirstName,MiddleName,LastName)VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
     [ author.TransactionType ,author.TransID ,author.TransTime ,author.TransAmount,author.BusinessShortCode,author.BillRefNumber,author.InvoiceNumber ,author.OrgAccountBalance ,author.ThirdPartyTransID,author.MSISDN ,author.FirstName,author.MiddleName,author.LastName] ,
      (err, res) => {
        if (err) throw err;
  
        console.log("Last insert ID:", res.transLoID);
      }
    );
  }catch(err){
    console.error(err.message);

  }

//   const author = req.body;

//       mysqlconnection.query('REPLACE INTO mobile_payments_confirmation SET ?', author, (err, res) => {

//       if (err) throw err;
      
//       console.log("Last insert ID:", res.insertId);

//     }
//   );
});

app.post("/validation_url", (req, res) => {
  console.log("Validation");

  try{

    const author = req.body;
    console.log(author);


    pool.query(
      "INSERT INTO mobile_payments (transID,TransactionType ,TransTime ,TransAmount,BusinessShortCode,BillRefNumber,InvoiceNumber ,OrgAccountBalance ,ThirdPartyTransID,MSISDN ,FirstName,MiddleName,LastName)VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
     [ author.TransactionType ,author.TransID ,author.TransTime ,author.TransAmount,author.BusinessShortCode,author.BillRefNumber,author.InvoiceNumber ,author.OrgAccountBalance ,author.ThirdPartyTransID,author.MSISDN ,author.FirstName,author.MiddleName,author.LastName],
      (err, res) => {
        if (err) throw err;
  
      }
    );
  }catch(err){
    console.error(err.message);

  }
  
});

app.post("/simulate", Token, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  let auth = "Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        ShortCode: "600347",
        CommandID: "CustomerPayBillOnline",
        Amount: "10",
        Msisdn: "254708374149",
        BillRefNumber: "TestAPi",
      },
    },

    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

// balance

app.get("/balance", Token, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
  let auth = "Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        Initiator: "testapi0347",
        SecurityCredential:
          "PmF6HqLA5JbwDBcMkUUgi3yKCD9GTLkAG1sGwnKztCyC8z+xLSpc9dKw4HHTOY0xCM81YFrb/K4HMSRIU1x78vAinILdu1eiB0g+rHOqig8yTdHogOzM6CCblKCjPVyqlxIgi9ZpiSgL0mp2xSGiZO7vS6xFd5IGaww1zoHRZbgsMP1KzdcacHJxgIfx2ovFxiGe4vN0L6Em8AqlCMnlIWXhoKiXOHkH4p9HyRsapqe2UJuWXWzTXGrxplrUJ9EMyKg15B+nsrNOYWv+z9q8HRwmSULH93jp75G/SzDsHWpHC2KgnOr8kHz3nHSuF8jjaGYerYyKGQlrPaWb8gGyUA==",
        CommandID: "AccountBalance",
        PartyA: "600347",
        IdentifierType: "4",
        Remarks: "remarks.......",
        QueueTimeOutURL: "https://bc2ac892b0b0.ngrok.io/timeout_url",
        ResultURL: "https://bc2ac892b0b0.ngrok.io/result_url",
      },
    },

    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

app.post("/timeout_url", (req, res) => {
  console.log("Balance Timeout");

  console.log(req.body);
});

app.post("/result_url", (req, res) => {
  console.log("Balance Result Response");

  console.log(req.body.ResultParameter);
});

// stk push

app.post("/stk", Token, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let auth = "Bearer " + req.access_token;

  let timestamp = moment().format("YYYYMMDDHHmmss");

  // const timestamp = date.getFullYear() + "" + "" + month + "" + "" + date.getDate() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds();
  const password = new Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  ).toString("base64");

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },

      json: {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: "254724437269",
        PartyB: "174379",
        PhoneNumber: "254724437269",
        CallBackURL: "https://bc2ac892b0b0.ngrok.io/stk_callback",
        AccountReference: "testapi0347",
        TransactionDesc: "Activate",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

app.post("/stk_callback", (req, res) => {
  console.log("Stk .....................");

  console.log(req.body.Body.stkCallback.CallbackMetadata);
});

// b2c

app.get("/b2c", Token, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  let auth = "Bearer " + req.access_token;

  let date = new Date();
  // let timestamp = date.getDate() + "" + "" + date.getMonth() + "" + "" + date.getFullYear() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds()
  const timestamp =
    date.getFullYear() +
    "" +
    "" +
    date.getMonth() +
    1 +
    "" +
    "" +
    date.getDate() +
    "" +
    "" +
    date.getHours() +
    "" +
    "" +
    date.getMinutes() +
    "" +
    "" +
    date.getSeconds();
  const password = new Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  ).toString("base64");

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },

      json: {
        InitiatorName: "testapi0347",
        SecurityCredential:
          "UFqQ94jjNxcDTTy3wqxxBukVEsx1YnpZRErWx2hTaoeHV/0JxCHTPitlNgGqAY6wUxNkOUpEbkgV4XfqFc2TIvSiYcVgyVNBjinUSrvOwxpfnOxjh4YQcnymP2OnIFH2m7dkO8YBbg/Odd2yNizhCUYhK6YkugoqfozsHJHnRh+vLvkcXPxqf6JJlGJKn2oeO5YiUGBQiFANL+sXuUWu9ussTupfVbqx4Bb6h+AGP8Q6a+LMLBq6TnYmlhblUrsoJu6Ke+DVVdrofGi6TJ4/LMaNjHdygj1PosZGVTXjmsyaEOnv7HkgsnbZPvwJt6B1IPOFaqC6Xl6v0I+T7ei0Ag==",
        CommandID: "BusinessPayment",
        Amount: "200",
        PartyA: "600347",
        PartyB: "254708374149",
        Remarks: "Salaried now",
        QueueTimeOutURL: "https://bc2ac892b0b0.ngrok.io/b2c_timeout_url",
        ResultURL: "https://bc2ac892b0b0.ngrok.io/b2c_result_url",
        Occasion: "EVE",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

app.post("/b2c_result_url", (req, res) => {
  console.log("b2c_result_url .....................");

  console.log(req.body.Result.ResultParameters);
});

app.post("/b2c_timeout_url", (req, res) => {
  console.log("b2c_timeout_url .....................");

  console.log(req.body);
});

function Token(req, resp, next) {
  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  let auth = new Buffer.from(
    "u8lDM8oGHqE9O8karnenhRS8bj4AUuI5:pXsgZK42HuYGKNug"
  ).toString("base64");

  request(
    {
      url: url,
      headers: {
        authorization: "Basic " + auth,
      },
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
}

// listen to ports
app.listen(port, (err, live) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server Running on  http://localhost:${port}`);
});

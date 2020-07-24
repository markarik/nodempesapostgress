CREATE DATABASE mpesa_data;

--\c into mobile_payments



CREATE TABLE mobile_payments (  
  transLoID SERIAL PRIMARY KEY,
  TransactionType varchar(30) NOT NULL,
  TransID varchar(30) UNIQUE NOT NULL,
  TransTime varchar(14) NOT NULL,
  TransAmount varchar(15) NOT NULL,
  BusinessShortCode varchar(15) NOT NULL,
  BillRefNumber varchar(255) ,
  InvoiceNumber varchar(15) NOT NULL,
  OrgAccountBalance varchar(30) NOT NULL,
  ThirdPartyTransID varchar(30) DEFAULT NULL,
  MSISDN varchar(14) NOT NULL,
  FirstName varchar(30),
  MiddleName varchar(30),
  LastName varchar(30)
);



--\c into mobile_payments_confirmation



CREATE TABLE mobile_payments_confirmation (
  transLoID SERIAL PRIMARY KEY,
  TransactionType varchar(30) NOT NULL,
  TransID varchar(30)UNIQUE NOT NULL,
  TransTime varchar(14) NOT NULL,
  TransAmount varchar(15) NOT NULL,
  BusinessShortCode varchar(15) NOT NULL,
  BillRefNumber varchar(255) ,
  InvoiceNumber varchar(15) NOT NULL,
  OrgAccountBalance varchar(30) NOT NULL,
  ThirdPartyTransID varchar(30) DEFAULT NULL,
  MSISDN varchar(14) NOT NULL,
  FirstName varchar(30),
  MiddleName varchar(30),
  LastName varchar(30)
);
const nodemailer = require("nodemailer");
const { mergeObjects } = require("../../shared/utils");

const prepareSendMailParams = (
  subject,
  body,
  from,
  fromName,
  to,
  toName,
  cc,
  bcc
) => {
  const sendMailParams = {
    from: fromName ? `"${fromName}" <${from}>` : from,
    to: toName ? `"${toName}" <${to}>` : to,
    subject: subject,
    html: body,
  };
  if (cc) {
    sendMailParams["cc"] = cc;
  }
  if (bcc) {
    sendMailParams["bcc"] = bcc;
  }
  return sendMailParams;
};

const createMailTransporter = (emailAccount) => {
  let params = {
    auth: {
      user: emailAccount.User,
      pass: emailAccount.Password,
    },
  };
  // if (emailAccount.Provider) {
  //   params = {
  //     ...params,
  //     service: emailAccount.Provider,
  //   };
  // } else {
  //   params = {
  //     ...params,
  //     host: emailAccount.Host,
  //     port: emailAccount.Port,
  //     secure: emailAccount.Secure,
  //   };
  // }
  params = {
    ...params,
    host: emailAccount.Host,
    port: emailAccount.Port,
    secure: emailAccount.Secure,
    tls:{
      cyphers: 'SSLv3'
    }
  };

  const transporter = nodemailer.createTransport(params);
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  return transporter;
};

class EmailSender {
  constructor() {}
  async sendEmail(
    emailAccountId,
    subject,
    body,
    from,
    fromName,
    to,
    toName,
    cc,
    bcc
  ) {
    // get email account by id or default.
    const emailAccount = await strapi.services[
      "email-account"
    ].getEmailByIdOrDefault(emailAccountId);
    if (emailAccount) {
      let transporter = createMailTransporter(emailAccount);
      // send mail with defined transport object
      const sendMailParams = prepareSendMailParams(
        subject,
        body,
        from,
        fromName,
        to,
        toName,
        cc,
        bcc
      );
      let info = await transporter.sendMail(sendMailParams);
      return info;
    }
    return null;
  }
}

module.exports = EmailSender;

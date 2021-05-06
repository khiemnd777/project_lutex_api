const nodemailer = require("nodemailer");
const { mergeObjects } = require("../../shared/utils");

const prepareSendMailParams = (subject, body, from, fromName, to, toName, cc, bcc) => {
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
  const params = {
    auth: {
      user: emailAccount.User,
      pass: emailAccount.Password,
    }
  };
  if (emailAccount.Provider) {
    params["service"] = emailAccount.Provider;
  } else {
    mergeObjects(params, {
      host: emailAccount.Host,
      port: emailAccount.Port,
      secure: emailAccount.Secure,
    });
  }
  const transporter = nodemailer.createTransport(params);
  return transporter;
};

export class EmailSender {
  constructor() {

  }
  async sendEmail(emailAccountId, subject, body, from, fromName, to, toName, cc, bcc) {
    // get email account by id or default.
    const emailAccount = await strapi.services["email-account"].getEmailByIdOrDefault(emailAccountId);
    if (sendMail) {
      let transporter = createMailTransporter(emailAccount);
      // send mail with defined transport object
      const sendMailParams = prepareSendMailParams(subject, body, from, fromName, to, toName, cc, bcc);
      let info = await transporter.sendMail(sendMailParams);
      return info;
    }
    return null;
  }
}

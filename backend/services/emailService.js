import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

const domain = process.env.MAILGUN_DOMAIN;
const apiKey = process.MAILGUN_API_KEY;

class MailgunService {
  constructor (apiKey, domain) {
    this.mg = mailgun.client({ username: 'api', key: apiKey });
  }

  sendEmail (from, to, subject, text) {
    const emailData = {
      from,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      text
    };

    return new Promise((resolve, reject) => {
      this.mg.messages.create(domain, emailData, (err, body) => {
        if (err) {
	  reject(err);
        } else {
	  resolve(body);
        }
      });
    });
  }
}

export default MailgunService;

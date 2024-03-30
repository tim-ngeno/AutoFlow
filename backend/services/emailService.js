import formData from 'form-data';
import Mailgun from 'mailgun.js';
import 'dotenv/config';

class MailgunService {
  constructor () {
    this.mailgun = new Mailgun(formData);
    this.domain = process.env.MAILGUN_DOMAIN;
    this.apiKey = process.env.MAILGUN_API_KEY;
    this.sender = process.env.SENDER_ADDRESS;

    this.mg = this.mailgun.client({ username: 'api', key: this.apiKey });
  }

  async sendEmail (recipient, subject, message) {
    console.log('Sending email...');
    try {
      // Send the email
      await this.mg.messages.create(this.domain, {
        from: this.sender,
        to: recipient,
        subject,
        text: message
      });

      console.log('Mail sent successfully!');
    } catch (err) {
      console.err('Unable to send mail:', err);
    }
  }
}

const mailService = new MailgunService();
export default mailService;

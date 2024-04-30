import logger from '../config/logger.js';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import 'dotenv/config';

class MailgunService {
  private readonly domain: string;
  private readonly apiKey: string;
  private readonly sender: string;
  private readonly mailgun
  private readonly mg: any

  constructor () {
    this.mailgun = new Mailgun.default(formData)
    this.domain = process.env.MAILGUN_DOMAIN || '';
    this.apiKey = process.env.MAILGUN_API_KEY || '';
    this.sender = process.env.SENDER_ADDRESS || '';

    this.mg = this.mailgun.client(
      { username: 'api', key: this.apiKey },
    );
  }

  async sendEmail (recipient: string, subject: string, message: string) {
    logger.info('Sending email...');
    try {
      // Send the email
      await this.mg.messages.create(this.domain, {
        from: this.sender,
        to: recipient,
        subject,
        text: message
      });

      logger.info('Mail sent successfully!');
    } catch (err) {
      console.error('Unable to send mail:', err);
    }
  }
}

const mailService = new MailgunService();
export default mailService;

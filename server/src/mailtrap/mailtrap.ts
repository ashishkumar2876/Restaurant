import {MailtrapClient} from 'mailtrap'

export const client = new MailtrapClient({
  token: process.env.MAIL_TRAP_API_TOKEN as string,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Ashish Mern Stack",
};
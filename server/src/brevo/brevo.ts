
// @ts-ignore
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY!;

export const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sender = {
  name: 'Ashish Food',
  email: 'ashishk792003@gmail.com', // Must be verified in Brevo
};

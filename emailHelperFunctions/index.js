const sgMail = require('@sendgrid/mail');
const resetTemplate = require('../templates/resetTemplate');
const { 
   sendGridKey, 
   sendGridUser, 
} = require('../envVariables');

function sendEmail(props) {
   const { email, token, admin } = props;
   sgMail.setApiKey(sendGridKey)
   const msg = {
      to: email,
      from: `TMovies <${sendGridUser}>`,
      subject: 'Reset Password',
      text: 'important',
      html: resetTemplate(token, admin),
   }
   sgMail
      .send(msg)
      .then(() => {
         console.log('Email sent')
   })
      .catch((error) => {
         console.error(error)
   })
}

module.exports = {
   sendEmail
}
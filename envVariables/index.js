const apiKey = process.env.API_KEY;
const resetPasswordSecret = process.env.RESET_PASS;
const gmailUser = process.env.GMAIL_USER;
const rounds = Number(process.env.ROUNDS);
const sendGridKey = process.env.SENDGRID_KEY;
const sendGridUser = process.env.SENDGRID_USER;
const jwtSecret = process.env.JWT_SECRET;

module.exports = {
   apiKey,
   resetPasswordSecret,
   gmailUser,
   rounds,
   sendGridKey,
   sendGridUser,
   jwtSecret
}

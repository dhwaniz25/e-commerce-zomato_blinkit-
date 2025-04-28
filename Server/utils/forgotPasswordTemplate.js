// const forgotPasswordTemplate = (name, otp) => {
//   return `
//         <div>
//             <p>Dear, ${name} </p>
//             <p>You're requested a password reset. Please use following OTP code to reset your password </p>
//             <div>${otp}</div>
//             <p>This OTP is only valid for 1 hour. Enter this OTP in the BlinkIt website to proceed with resetting your password</p>
//             <br/>
//             </br>
//             <p>Thanks</p>
//             <p>BlinkIt</p>
//         </div>
//     `;
// };

const forgotPasswordTemplate = (name, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Hi ${name},</h2>
      <p style="font-size: 16px; color: #555;">
        You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #fff; background-color: #007bff; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #888;">
        This OTP is valid for <strong>1 hour</strong>. Please enter it on the <strong>BlinkIt</strong> website to proceed with resetting your password.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
      <p style="font-size: 14px; color: #777;">Thanks,<br><strong>BlinkIt Team</strong></p>

      <!-- Beautiful footer below -->
      <div style="margin-top: 50px; padding: 20px; text-align: center; font-size: 13px; color: #666; background-color: #f0f0f0; border-top: 1px solid #ddd; border-radius: 0 0 10px 10px;">
        <p style="margin: 0;">
          Made with 
          <span style="color: red; font-size: 16px;">❤️</span> 
          by <strong style="color: #333;">DHWANI ZAVERI</strong>
        </p>
      </div>
    </div>
  `;
};

module.exports = forgotPasswordTemplate;

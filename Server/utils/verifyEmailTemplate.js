// const verifyEmailTemplate = ({ name, url }) => {
//   return `
//         <p>Dear ${name}</p>
//         <p>Thank you for registering with us !</p>
//         <a href=${url} style="color:white; background: blue; margin-top:10px">
//             Verify Email
//         </a>
//     `;
// };

// const verifyEmailTemplate = ({ name, url }) => {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Email Verification</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           line-height: 1.6;
//           color: #333;
//           max-width: 600px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           text-align: center;
//           padding-bottom: 20px;
//           border-bottom: 1px solid #eee;
//         }
//         .logo {
//           max-width: 150px;
//         }
//         .content {
//           padding: 20px 0;
//         }
//         .button {
//           display: inline-block;
//           padding: 12px 24px;
//           background-color: #2563eb;
//           color: white !important;
//           text-decoration: none;
//           border-radius: 4px;
//           font-weight: bold;
//           margin: 20px 0;
//         }
//         .footer {
//           margin-top: 30px;
//           padding-top: 20px;
//           border-top: 1px solid #eee;
//           font-size: 12px;
//           color: #666;
//           text-align: center;
//         }
//         .highlight {
//           font-weight: bold;
//           color: #2563eb;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>Welcome to <span class="highlight">Blinkit</span></h1>
//       </div>
      
//       <div class="content">
//         <p>Dear ${name},</p>
//         <p>Thank you for registering with us! We're excited to have you on board.</p>
//         <p>To complete your registration, please verify your email address by clicking the button below:</p>
        
//         <div style="text-align: center; margin: 25px 0;">
//           <a href="${url}" class="button">Verify Email Address</a>
//         </div>
        
//         <p>If the button above doesn't work, copy and paste this link into your browser:</p>
//         <p style="word-break: break-all;">${url}</p>
        
//         <p>This verification link will expire in 24 hours.</p>
//       </div>
      
//       <div class="footer">
//         <p>If you didn't request this email, please ignore it.</p>
//         <p>© ${new Date().getFullYear()} Blinkit. All rights reserved.</p>
//       </div>
//     </body>
//     </html>
//   `;
// };

const verifyEmailTemplate = ({ name, url }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
          color: #333;
          margin: 0;
        }
        .highlight {
          font-weight: bold;
          color: #2563eb;
        }
        .content {
          padding: 20px 0;
          color: #444;
        }
        .content p {
          font-size: 16px;
          margin: 12px 0;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          background-color: #2563eb;
          color: #fff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
        }
        .link-text {
          font-size: 14px;
          color: #777;
          word-break: break-all;
        }
        .footer {
          font-size: 13px;
          color: #888;
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .custom-footer {
          margin-top: 20px;
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 8px;
          font-size: 12px;
          color: #666;
        }
        .custom-footer span {
          color: red;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to <span class="highlight">Blinkit</span></h1>
        </div>

        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for registering with us! We're excited to have you on board.</p>
          <p>To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div class="button-container">
            <a href="${url}" class="button">Verify Email Address</a>
          </div>

          <p>If the button above doesn't work, copy and paste this link into your browser:</p>
          <p class="link-text">${url}</p>

          <p>This verification link will expire in 24 hours.</p>
        </div>

        <div class="footer">
          <p>If you didn't request this email, please ignore it.</p>
          <p>© ${new Date().getFullYear()} Blinkit. All rights reserved.</p>

          <div class="custom-footer">
            Made with <span>❤️</span> by <strong>DHWANI ZAVERI</strong>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};


module.exports = verifyEmailTemplate;

// module.exports = verifyEmailTemplate;

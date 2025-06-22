const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div>
        <p>Dear ${name}</p>
        <p>Please use the following OTP to reset your password</p>
        <div style="background:yellow; font-size:20px; padding:20px; text-align:center; font-weight:800;">
            ${otp}
        </div>
        <p>This OTP is valid for 1 hour only</p>
        <br/>
        <br/>
        <p>Thanks</p>
        <p>Blinkit team</p>
    </div>
  `;
};

module.exports = forgotPasswordTemplate;
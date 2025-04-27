import nodemailer from 'nodemailer';

const sendEmail = async ({to ,subject,html}) => {

    const transporter = nodemailer.createTransport( {
        // host: "smtp.gmail.com",
        // port:465,
        // secure:true,
        service:'gmail',
        auth: {
            user:process.env.EMAIL,
            pass:process.env.PASS,
        },
        tls : {
            rejectUnauthorized : false
      }
    })
    const info = await transporter.sendMail({
        from:`"Social Media Application" <${process.env.EMAIL}>`,
        to,
        subject,
        html,
    })

    return info.rejected.length === 0 ? true : false;
console.log(info)
}

export const subject = {
    register:"Activate Account",
    resetPassword:"Reset Password",
    updateEmail: "Update Email"
}

export default sendEmail;

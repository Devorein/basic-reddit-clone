import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail (to: string, html: string) {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: 'o6swskvouk2vm55h@ethereal.email', // generated ethereal user
			pass: 'egaucR6rXAr4kU2mfy' // generated ethereal password
		}
	});

	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: '"Lireddit 👻" <foo@example.com>', // sender address
		to, // list of receivers
		subject: 'Change password', // Subject line
		html
	});

	console.log('Message sent: %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

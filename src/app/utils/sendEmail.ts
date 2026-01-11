import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../errors/appError';
import httpStatus from 'http-status';

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: config.node_env === 'production', // true for port 465, false for other ports
			auth: {
				user: config.node_mailer_sender_email,
				pass: config.node_mailer_app_password,
			},
		});

		const info = await transporter.sendMail({
			from: config.node_mailer_sender_email, // sender address
			to, // list of receivers
			subject, // Subject line
			text, // plain text body
			html, // html body
		});

		console.log('Email Sent', info.response);
		return { success: true, message: 'Email sent successfully' };
	} catch (error) {
		console.error('Error sending email:', error);
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Email sending failed');
	}
};

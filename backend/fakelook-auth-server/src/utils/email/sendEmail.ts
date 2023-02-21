import { BadRequestError } from "@bshfakelook/common";
import nodemailer from "nodemailer";
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

export const sendMail = async (sendTo: string, subject: string, body: string) => {
  const response = await transporter.sendMail({
    to: sendTo,
    from: "bshraib2022@outlook.com",
    subject: subject,
    html: body,
  });
  if(response.rejected) {
    throw new BadRequestError('sending email failed.')
  }
};

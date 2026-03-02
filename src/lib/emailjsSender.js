import emailjs from "@emailjs/browser";

async function sendEmailJS(params) {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    params,
    { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
  );
}

export { sendEmailJS };
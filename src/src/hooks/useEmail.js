import emailjs from "@emailjs/browser";

export default () => {
  const sendEmail = (values) => {
    const YOUR_SERVICE_ID = "YOUR_SERVICE_ID";
    const YOUR_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const YOUR_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
    
    emailjs.sendForm(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, values, YOUR_PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }

  return { sendEmail }
};

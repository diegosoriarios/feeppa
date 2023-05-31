import emailjs from "@emailjs/browser";

function useEmail() {
  const sendEmail = (values) => {
    try {
      const YOUR_SERVICE_ID = "service_zbw4o9e";
      const YOUR_TEMPLATE_ID = "template_d0ln48v";
      const YOUR_PUBLIC_KEY = "WEZ1ijt6xNQDANiVd";

      const email = emailjs
        .send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, values, YOUR_PUBLIC_KEY)
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    } catch (e) {
      console.log("EMAIL ERROR", e);
    }
  };

  return { sendEmail };
}

export default useEmail;

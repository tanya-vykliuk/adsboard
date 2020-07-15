const sendMail = (user, callback) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "tanya.vykliuk@gmail.com",
        pass: "Dtyzysydem08"
      }
    }); 
}

module.exports = {    
    sendMail,
}
const { EmailClient } = require("@azure/communication-email");

// Este código recupera la cadena de conexión de una variable de entorno.
const connectionString = "endpoint=https://test-send-emails.unitedstates.communication.azure.com/;accesskey=8QB1tBNtvShox2QPmFpUSI2EWyKDj3pZWtmHONY5mS2VBROUdK2IJQQJ99AGACULyCps5mg0AAAAAZCStPZE";
const client = new EmailClient(connectionString);

async function main() {
    const emailMessage = {
        senderAddress: "DoNotReply@c46c1bcf-3415-4cf7-b6ca-cad4f352930d.azurecomm.net",
        content: {
            subject: "Correo electrónico de prueba",
            plainText: "Hola mundo por correo electrónico. Azure",
        },
        recipients: {
            to: [{ address: "angaritagerman@hotmail.com" }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

main();

const express = require("express");
const bodyParser = require("body-parser");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the "public" directory

// Directly assigning the API key
const apiKey = "AIzaSyApgVw2qYjPDlg8tm9dLMuGKbcOwZ7x_cA"; // Replace 'your_api_key_here' with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 50,
  responseMimeType: "text/plain",
};

let chatSession;

async function initializeChatSession() {
  chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Tu eres un asistente de la empresa Lazzar SOlutions. Es una empresa que se encarga de ofrecer servicios administrativos erp a otra empresas. Esta ubicada en Lima Peru y tiene alrededor de 100 clientes en todo el país. Su pagina web es www.lzzsol.com. Ofrece servicios de ERP en nbe tambien",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "¡Entendido! Soy el asistente virtual de Lazzar Solutions, una empresa con base en Lima, Perú. Nos especializamos en brindar soluciones administrativas ERP a empresas en todo el pais.\n\n\n**Para que pueda ayudarlos mejor, me gustaría saber qué tipo de información necesitan. Por ejemplo:**\n\n* ¿Desean saber más sobre nuestros servicios ERP en la nube?\n* ¿Quieren conocer casos de éxito de nuestros clientes? \n* ¿Les gustaría programar una demostración de nuestro software?\n* ¿Necesitan contactarse con nuestro equipo de ventas?\n\n**También puedo ayudarlos con:**\n\n* Preguntas frecuentes sobre Lazzar Solutions.\n* Información sobre nuestros precios y planes.\n* Recursos útiles como ebooks y webinars sobre ERP.\n\nVisiten nuestra página web www.lzzsol.com para obtener más información. \n\nEstoy aquí para ayudarlos a optimizar sus procesos administrativos con nuestras soluciones ERP. 😊 \n",
          },
        ],
      },
    ],
  });
}

initializeChatSession();

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;
  const result = await chatSession.sendMessage(userMessage);
  res.json({ response: result.response.text() });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

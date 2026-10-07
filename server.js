const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// index.html ni internetda ko'rsatish
app.use(express.static(__dirname));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/solve", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Masala yuborilmadi"
            });
        }

        const response = await client.responses.create({
            model: "gpt-6-luna",
            input: `Sen matematika masalalarini yechadigan AI yordamchisan.

Masalani o'zbek tilida yech.
Qisqa ishlanishni ko'rsat.

Javobni faqat oddiy matn bilan yoz.
LaTeX ishlatma.
Markdown ishlatma.
\\times, \\div, \\frac, \\sqrt kabi belgilarni ishlatma.

Matematik amallar uchun faqat quyidagi belgilarni ishlat:
+  -  *  /  =  (  )

Masalan:
5 * 5 + 5 - 5 / 5 = 29

Javobni tushunarli va oddiy ko'rinishda yoz.

Masala:
${question}`
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error(
            "OPENAI ERROR:",
            error.status,
            error.code,
            error.message
        );

        res.status(500).json({
            error: "AI xatosi: " + (error.message || "noma'lum xato")
        });
    }
});

app.listen(3000, () => {
    console.log("AI BACKEND ISHLAYAPTI");
    console.log("http://localhost:3000");
});
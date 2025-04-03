import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { db } from "./config/firebase-config.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
    res.send("Servidor backend funcionando 🚀");
});

// Ruta de registro
app.post("/api/auth/register", async (req, res) => {
    try {
        const { email, username, password, role = 'common_user' } = req.body;

        // Check if user already exists
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user document
        const userDoc = {
            email,
            username,
            password: hashedPassword,
            role,
            dateRegister: new Date(),
            lastLogin: null
        };

        await db.collection('users').add(userDoc);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

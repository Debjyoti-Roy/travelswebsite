import { https } from "firebase-functions";
import { initializeApp, auth } from "firebase-admin";
const cors = require("cors")({ origin: true });

initializeApp();

export const setUserRole = https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) return res.status(401).send("Unauthorized");

      const decoded = await auth().verifyIdToken(idToken);
      await auth().setCustomUserClaims(decoded.uid, { role: "USER" });

      return res.status(200).send("Role set successfully");
    } catch (error) {
      console.error("Error setting custom claim:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});

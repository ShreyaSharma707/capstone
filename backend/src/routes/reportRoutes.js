import { Router } from "express";
import { getSummaryReport } from "../controllers/reportController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.js";

const router = Router();

// Allow public access to summary reports for integration testing
router.get("/", getSummaryReport);

// POST endpoint for user-submitted hazard reports (placeholder)
router.post("/", async (req, res) => {
  // For now, just acknowledge receipt
  // TODO: Implement proper Report model and storage
  console.log("Received hazard report:", req.body);
  res.status(201).json({
    success: true,
    message: "Report received",
    data: { ...req.body, id: Date.now() },
  });
});

export default router;

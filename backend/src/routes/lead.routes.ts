import { Router } from "express";
import { leadController } from "../controllers/lead.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { createLeadSchema, listLeadsQuerySchema, updateStatusSchema } from "../validators/lead.validator.js";
import { leadSubmitLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Public — create a new lead
router.post("/", leadSubmitLimiter, validate(createLeadSchema), leadController.create);

// Protected — list leads with search/filter/pagination
router.get("/", authenticate, validate(listLeadsQuerySchema, "query"), leadController.list);

// Protected — get single lead
router.get("/:id", authenticate, leadController.getById);

// Protected — update lead status
router.patch("/:id/status", authenticate, validate(updateStatusSchema), leadController.updateStatus);

export default router;

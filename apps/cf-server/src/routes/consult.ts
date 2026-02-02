import { Hono } from "hono";
import type { CloudflareBindings } from "../types";
import {
  scheduleConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus,
} from "../controllers/consultation";

const consultRoutes = new Hono<{ Bindings: CloudflareBindings }>();

// POST /consult - Schedule a new consultation
consultRoutes.post("/", scheduleConsultation);

// GET /consult - Get all consultations with optional filters
consultRoutes.get("/", getAllConsultations);

// GET /consult/:id - Get a specific consultation by ID
consultRoutes.get("/:id", getConsultationById);

// PATCH /consult/:id/status - Update consultation status
consultRoutes.patch("/:id/status", updateConsultationStatus);

export default consultRoutes;

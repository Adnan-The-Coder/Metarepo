import { Hono } from "hono";
import type { CloudflareBindings } from "../types";
import {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
  getResultByRollNumber,
} from "../controllers/ou.results.controller";

const ouResultsRoutes = new Hono<{ Bindings: CloudflareBindings }>();

// POST /ou-results - Create a new result record
ouResultsRoutes.post("/", createResult);

// GET /ou-results - Get all results with pagination and filtering
ouResultsRoutes.get("/", getAllResults);

// GET /ou-results/:id - Get a specific result by ID
ouResultsRoutes.get("/:id", getResultById);

// PUT /ou-results/:id - Update a result record
ouResultsRoutes.put("/:id", updateResult);

// DELETE /ou-results/:id - Delete a result record
ouResultsRoutes.delete("/:id", deleteResult);

// GET /ou-results/rollnumber/:rollnumber - Get results by roll number
ouResultsRoutes.get("/rollnumber/:rollnumber", getResultByRollNumber);

export default ouResultsRoutes;

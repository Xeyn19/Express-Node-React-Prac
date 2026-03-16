import express from "express";
import {
  createJob,
  deleteJob,
  getJobs,
  updateJob,
} from "../controllers/jobController.js";
import { authenticateAccessToken } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/resumeUpload.js";

const jobRouter = express.Router();

jobRouter.post("/", authenticateAccessToken, uploadResume, createJob);
jobRouter.get("/", authenticateAccessToken, getJobs);
jobRouter.delete("/:id", authenticateAccessToken, deleteJob);
jobRouter.patch("/:id", authenticateAccessToken, uploadResume, updateJob);

export default jobRouter;

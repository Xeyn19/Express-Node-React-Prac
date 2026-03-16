import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  createJobApplication,
  deleteJobApplicationById,
  getJobApplicationsByUserId,
} from "../models/jobModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads/resumes");

const allowedStatuses = new Set(["Applied", "Interview", "Offer", "Rejected"]);

const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const cleanupResume = async (file) => {
  if (!file?.filename) {
    return;
  }

  try {
    await fs.unlink(path.join(uploadsDir, file.filename));
  } catch {
    return;
  }
};

export const createJob = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      await cleanupResume(req.file);
      return res.status(401).json({ message: "Unauthorized." });
    }

    const {
      company,
      position,
      status = "Applied",
      date_applied,
      job_url,
      notes,
      resume_path,
    } = req.body || {};

    if (!company?.trim() || !position?.trim()) {
      await cleanupResume(req.file);
      return res
        .status(400)
        .json({ message: "Company and position are required." });
    }

    if (!allowedStatuses.has(status)) {
      await cleanupResume(req.file);
      return res.status(400).json({
        message: "Invalid status. Use Applied, Interview, Offer, or Rejected.",
      });
    }

    let dateApplied = date_applied;
    if (!dateApplied) {
      dateApplied = new Date().toISOString().slice(0, 10);
    } else if (!isValidDateString(dateApplied)) {
      await cleanupResume(req.file);
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const resumePath = req.file
      ? `/uploads/resumes/${req.file.filename}`
      : null;

    const insertId = await createJobApplication({
      userId,
      company: company.trim(),
      position: position.trim(),
      status,
      dateApplied,
      jobUrl: job_url?.trim() || null,
      notes: notes?.trim() || null,
      resumePath,
    });

    return res.status(201).json({
      message: "Job application created.",
      job: {
        id: insertId,
        company: company.trim(),
        position: position.trim(),
        status,
        date_applied: dateApplied,
        job_url: job_url?.trim() || null,
        notes: notes?.trim() || null,
        resume_path: resumePath,
      },
    });
  } catch (error) {
    await cleanupResume(req.file);
    return res.status(500).json({
      message: "Unable to create job application.",
      error: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const jobs = await getJobApplicationsByUserId(userId);
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const withResumeUrls = jobs.map((job) => ({
      ...job,
      resume_url: job.resume_path ? `${baseUrl}${job.resume_path}` : null,
    }));

    return res.status(200).json({
      message: "Job applications fetched.",
      jobs: withResumeUrls,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch job applications.",
      error: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const jobId = Number(req.params.id);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({ message: "Invalid job id." });
    }

    const deletedRows = await deleteJobApplicationById(userId, jobId);

    if (!deletedRows) {
      return res.status(404).json({ message: "Job application not found." });
    }

    return res.status(200).json({ message: "Job application deleted." });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete job application.",
      error: error.message,
    });
  }
};

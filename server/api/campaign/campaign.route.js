import express from "express";
import protectRoute from "../../middlewares/protectRoute.js";
import {
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  getAllVolunteerRequests,
  handleVolunteerRequest,
  updateCampaign,
  volunteerForCampaign,
} from "./campaign.controller.js";
const router = express.Router();

// Create a new campaign
router.post("/", protectRoute, createCampaign);

// Update a campaign by ID
router.put("/:id", protectRoute, updateCampaign);

// Delete a campaign by ID
router.delete("/:id", protectRoute, deleteCampaign);

router.get("/volunteerRequests", protectRoute, getAllVolunteerRequests);

// Get a campaign by ID
router.get("/:id", protectRoute, getCampaignById);

// Get all campaigns (with optional pagination and sorting)
router.get("/", protectRoute, getAllCampaigns);

router.post("/:id/volunteer", protectRoute, volunteerForCampaign);

router.put("/:id/volunteer/:requestId",protectRoute,handleVolunteerRequest);



export default router;

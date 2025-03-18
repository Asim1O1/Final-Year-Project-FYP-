import createResponse from "../../utils/responseBuilder.js";

import Campaign from "../../models/campaign.model.js";
import Hospital from "../../models/hospital.model.js";
import Notification from "../../models/notification.model.js";
import userModel from "../../models/user.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { emailTemplates } from "../../utils/emailTemplates.js";

export const createCampaign = async (req, res, next) => {
  const {
    title,
    description,
    date,
    location,
    hospital,
    maxVolunteers,
    allowVolunteers,
  } = req.body;

  // Validate request body
  if (!title || !description || !date || !location || !hospital) {
    return res.status(400).json(
      createResponse({
        isSuccess: false,
        statusCode: 400,
        message:
          "All fields are required: title, description, date, location, hospital",
        error: null,
        data: null,
      })
    );
  }

  try {
    // Check if hospital exists
    const hospitalExists = await Hospital.exists({ _id: hospital });
    if (!hospitalExists) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
          error: null,
          data: null,
        })
      );
    }

    // Check if user is authorized to create campaigns
    if (req.user.role !== "hospital_admin") {
      return res.status(403).json(
        createResponse({
          isSuccess: false,
          statusCode: 403,
          message: "Unauthorized: Only hospital admins can create campaigns",
          error: null,
          data: null,
        })
      );
    }

    // Create and save the campaign
    const campaign = new Campaign({
      title,
      description,
      date,
      location,
      hospital,
      createdBy: req.user._id,
      allowVolunteers: allowVolunteers || false,
      maxVolunteers: maxVolunteers || 0,
    });

    await campaign.save();

    // Fetch all users
    const users = await userModel.find({ role: "user" }, "_id email");

    // Create notifications for all users
    const notifications = users.map((user) => ({
      user: user._id,
      message: `New campaign: ${title}. Join us on ${new Date(
        date
      ).toLocaleDateString()} at ${location}.`,
      type: "campaign",
      relatedId: campaign._id, // Linking the notification to the campaign
    }));

    await Notification.insertMany(notifications);

    // Emit event via Socket.io
    const io = req.app.get("socketio");
    io.emit("new-campaign", { message: `New campaign: ${title}` });

    // Send email notifications
    for (const user of users) {
      const data = {
        fullName: user.fullName,
        title: campaign.title,
        date: new Date(campaign.date).toLocaleDateString(),
        location: campaign.location,
      };

      const subject = emailTemplates.campaignCreated.subject;
      const template = emailTemplates.campaignCreated;

      await sendEmail(user.email, subject, template, data);
    }

    // Return success response
    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Campaign created successfully",
        error: null,
        data: campaign,
      })
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return next(error);
  }
};


export const updateCampaign = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, date, location, hospital } = req.body;

  // Validate request body
  if (!title && !description && !date && !location && !hospital) {
    return res.status(400).json(
      createResponse({
        isSuccess: false,
        statusCode: 400,
        message:
          "At least one field is required to update: title, description, date, location, hospital",
        error: null,
        data: null,
      })
    );
  }

  try {
    // Find the campaign by ID
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Campaign not found",
          error: null,
          data: null,
        })
      );
    }

    // Check if the user is authorized to update the campaign
    if (
      campaign.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json(
        createResponse({
          isSuccess: false,
          statusCode: 403,
          message:
            "Unauthorized: Only the creator or admin can update this campaign",
          error: null,
          data: null,
        })
      );
    }

    // Update the campaign fields
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (date) campaign.date = date;
    if (location) campaign.location = location;
    if (hospital) {
      const hospitalExists = await Hospital.findById(hospital);
      if (!hospitalExists) {
        return res.status(404).json(
          createResponse({
            isSuccess: false,
            statusCode: 404,
            message: "Hospital not found",
            error: null,
            data: null,
          })
        );
      }
      campaign.hospital = hospital;
    }

    await campaign.save();

    // Return success response
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Campaign updated successfully",
        error: null,
        data: campaign,
      })
    );
  } catch (error) {
    console.error("Error updating campaign:", error);
    return next(error);
  }
};

export const deleteCampaign = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the campaign by ID
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Campaign not found",
          error: null,
          data: null,
        })
      );
    }

    // Check if the user is authorized to delete the campaign
    if (
      campaign.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json(
        createResponse({
          isSuccess: false,
          statusCode: 403,
          message:
            "Unauthorized: Only the creator or admin can delete this campaign",
          error: null,
          data: null,
        })
      );
    }

    // Delete the campaign
    await Campaign.findByIdAndDelete(id);

    // Return success response
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Campaign deleted successfully",
        error: null,
        data: null,
      })
    );
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return next(error);
  }
};

export const getCampaignById = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the campaign by ID and populate related fields
    const campaign = await Campaign.findById(id)
      .populate("hospital", "name address")
      .populate("createdBy", "name email")
      .populate("volunteers", "name email");

    if (!campaign) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Campaign not found",
          error: null,
          data: null,
        })
      );
    }

    // Return success response
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Campaign retrieved successfully",
        error: null,
        data: campaign,
      })
    );
  } catch (error) {
    console.error("Error retrieving campaign:", error);
    return next(error);
  }
};

export const getAllCampaigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt" } = req.query;

    // Parse sort parameters
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (!pageNum && !limitNum) {
      // If pagination params are missing, return all campaigns
      const campaigns = await Campaign.find()
        .populate("hospital", "name address")
        .populate("createdBy", "name email")
        .populate("volunteers", "name email");

      return res.status(200).json(
        createResponse({
          isSuccess: true,
          statusCode: 200,
          message: "All campaigns fetched successfully",
          data: {
            campaigns,
            pagination: null,
          },
          error: null,
        })
      );
    }

    // Implement pagination logic
    const totalCount = await Campaign.countDocuments({});
    const totalPages = Math.ceil(totalCount / limitNum);

    // Fetch campaigns with pagination and populate related fields
    const campaigns = await Campaign.find()
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort(sortOptions)
      .populate("hospital", "name address")
      .populate("createdBy", "name email")
      .populate("volunteers", "name email");

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Campaigns retrieved successfully",
      data: campaigns.map((campaign) => ({
        ...campaign.toObject(),
      })),
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return next(error);
  }
};

export const volunteerForCampaign = async (req, res, next) => {
  const { id } = req.params; // Campaign ID
  const userId = req.user._id; // Logged-in user ID

  try {
    // Find the campaign by ID
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Campaign not found",
          error: null,
          data: null,
        })
      );
    }

    // Check if the user is already a volunteer
    if (campaign.volunteers.includes(userId)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "You are already a volunteer for this campaign",
          error: null,
          data: null,
        })
      );
    }

    // Add the user to the volunteers list
    campaign.volunteers.push(userId);
    await campaign.save();

    // Create a notification for the user
    const notification = new Notification({
      user: userId,
      message: `You have successfully volunteered for the campaign: ${campaign.title}`,
      type: "volunteer",
    });
    await notification.save();

    // Emit real-time notification using Socket.IO
    const io = req.app.get("socketio");
    io.to(userId.toString()).emit("new-notification", {
      message: `You have successfully volunteered for the campaign: ${campaign.title}`,
    });

    // Return success response
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Successfully volunteered for the campaign",
        error: null,
        data: {
          campaignId: campaign._id,
          volunteers: campaign.volunteers,
        },
      })
    );
  } catch (error) {
    console.error("Error volunteering for campaign:", error);
    return next(error);
  }
};

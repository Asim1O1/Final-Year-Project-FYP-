import createResponse from "../../utils/responseBuilder.js";
import Campaign from "../../models/campaign.model.js";
import Hospital from "../../models/hospital.model.js";
import Notification from "../../models/notification.model.js";
import userModel from "../../models/user.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { emailTemplates } from "../../utils/emailTemplates.js";
import {paginate} from "../../utils/paginationUtil.js";

export const createCampaign = async (req, res, next) => {
  const {
    title,
    description,
    date,
    location,
    hospital,
    maxVolunteers,
    allowVolunteers,
    volunteerQuestions, // Questions for volunteers
  } = req.body;

  console.log("Creating campaign with data:", req.body);

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

    // Create campaign
    const campaign = new Campaign({
      title,
      description,
      date,
      location,
      hospital,
      createdBy: req.user._id,
      allowVolunteers: allowVolunteers || false,
      maxVolunteers: maxVolunteers || 0,
      volunteerQuestions: volunteerQuestions || [], // Store questions
    });

    await campaign.save();

    // Notify all users
    const users = await userModel.find({ role: "user" }, "_id email");
    const notifications = users.map((user) => ({
      user: user._id,
      message: `New campaign: ${title}. Join us on ${new Date(
        date
      ).toLocaleDateString()} at ${location}.`,
      type: "campaign",
      relatedId: campaign._id,
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
      const template = emailTemplates.campaignCreated;
      const subject = emailTemplates.campaignCreated.subject;

      await sendEmail(user.email, subject, template, data);
    }

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
  console.log("ENETERDD ENETERD")
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
  const { id } = req.params;
  const userId = req.user._id;
  const { answers } = req.body;

  try {
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

    // Ensure all questions are answered
    if (
      !answers ||
      Object.keys(answers).length !== campaign.volunteerQuestions.length
    ) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "All volunteer questions must be answered",
          error: null,
          data: null,
        })
      );
    }

    // Check if the user already submitted a request
    if (
      campaign.volunteerRequests.some(
        (req) => req.user.toString() === userId.toString()
      )
    ) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "You have already submitted a request for this campaign",
          error: null,
          data: null,
        })
      );
    }

    // Store the volunteer request
    campaign.volunteerRequests.push({
      user: userId,
      status: "pending",
      requestedAt: new Date(),
      answers,
    });

    await campaign.save();

    // Notify the hospital admin
    const hospitalAdmin = await userModel.findOne({
      role: "hospital_admin",
      hospital: campaign.hospital,
    });
    if (hospitalAdmin) {
      const notification = new Notification({
        user: hospitalAdmin._id,
        message: `New volunteer request for campaign: ${campaign.title}`,
        type: "volunteer_request",
      });
      await notification.save();

      const io = req.app.get("socketio");
      io.to(hospitalAdmin._id.toString()).emit("new-notification", {
        message: `New volunteer request for campaign: ${campaign.title}`,
      });
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Volunteer request submitted. Awaiting approval.",
        error: null,
        data: null,
      })
    );
  } catch (error) {
    console.error("Error submitting volunteer request:", error);
    return next(error);
  }
};

export const handleVolunteerRequest = async (req, res, next) => {
  const { id, requestId } = req.params; // Campaign ID & Volunteer Request ID
  const { status } = req.body; // "approved" or "rejected"

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

    // Find the volunteer request
    const volunteerRequest = campaign.volunteerRequests.id(requestId);
    if (!volunteerRequest) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Volunteer request not found",
          error: null,
          data: null,
        })
      );
    }

    // Update the request status
    volunteerRequest.status = status;

    if (status === "approved") {
      campaign.volunteers.push(volunteerRequest.user);
    }

    await campaign.save();

    // Notify the user about approval/rejection
    const notification = new Notification({
      user: volunteerRequest.user,
      message: `Your volunteer request for campaign "${campaign.title}" has been ${status}.`,
      type: "campaign",
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get("socketio");
    io.to(volunteerRequest.user.toString()).emit("new-notification", {
      message: `Your volunteer request for campaign "${campaign.title}" has been ${status}.`,
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: `Volunteer request ${status} successfully.`,
        error: null,
        data: null,
      })
    );
  } catch (error) {
    console.error("Error handling volunteer request:", error);
    return next(error);
  }
};

export const getAllVolunteerRequests = async (req, res, next) => {
  console.log("entered the get all volynteer requests")

  try {
    const { page, limit } = req.query;

    const result = await paginate(
      Campaign,
      { "volunteerRequests": { $exists: true, $ne: [] } }, // Ensures non-empty volunteer requests
      {
        page,
        limit,
        sort: { "volunteerRequests.requestedAt": -1 }, // Sort by request date
        populate: {
          path: "volunteerRequests.user",
          model: "User", // Ensure this matches your Mongoose User model
          select: "name email",
        },
      }
    );

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Volunteer requests retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching volunteer requests:", error);
    next(error);
  }
};

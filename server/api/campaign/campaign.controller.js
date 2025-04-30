import Campaign from "../../models/campaign.model.js";
import Hospital from "../../models/hospital.model.js";
import Notification from "../../models/notification.model.js";
import userModel from "../../models/user.model.js";
import { onlineUsers } from "../../server.js";
import { paginate } from "../../utils/paginationUtil.js";
import createResponse from "../../utils/responseBuilder.js";
import { logActivity } from "../activity/activity.controller.js";

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
    // Get full hospital details instead of just checking existence
    const hospitalData = await Hospital.findById(hospital);
    console.log("The hospital data", hospitalData);

    if (!hospitalData) {
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
    await logActivity("campaign_created", {
      // Core Activity Data
      title: `Campaign Created: ${title}`,
      description: `A new campaign titled "${title}" is scheduled for ${date} at ${location}, organized by ${hospitalData.name}.`,

      performedBy: {
        role: req.user?.role || "hospital_admin",
        userId: req.user?._id,
        name: req.user?.fullName,
      },

      // Visibility: who can see this activity
      visibleTo: ["hospital_admin"],
    });

    const users = await userModel.find({ role: "user" }, "_id email");

    // Consistent message
    const campaignMessage = `New campaign: ${title}. Join us on ${new Date(
      date
    ).toLocaleDateString()} at ${location}.`;

    // Save notifications to DB
    const notifications = users.map((user) => ({
      user: user._id,
      message: campaignMessage,
      type: "campaign",
      relatedId: campaign._id,
      createdAt: new Date(), // ✅ Add this for DB consistency too
    }));

    await Notification.insertMany(notifications);
    console.log("📩 Campaign notifications saved");

    // Real-time to online users
    const io = req.app.get("socketio");
    for (const user of users) {
      const socketId = onlineUsers.get(user._id.toString());
      if (socketId) {
        io.to(user._id.toString()).emit("campaign", {
          id: campaign._id,
          message: campaignMessage,
          type: "campaign",
          createdAt: new Date().toISOString(), // ✅ Add this line
        });
        console.log(`📡 Real-time campaign sent to user ${user._id}`);
      }
    }

    // Send email notifications
    // for (const user of users) {
    //   const data = {
    //     fullName: user.fullName,
    //     title: campaign.title,
    //     date: new Date(campaign.date).toLocaleDateString(),
    //     location: campaign.location,
    //   };
    //   const template = emailTemplates.campaignCreated;
    //   const subject = emailTemplates.campaignCreated.subject;

    //   await sendEmail(user.email, subject, template, data);
    // }

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
  const { title, description, date, location } = req.body;

  console.log("🔧 Update Campaign Request Received");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("User:", req.user);

  // Validate request body
  if (!title && !description && !date && !location) {
    console.warn("⚠️ No fields provided to update");
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
    console.log("🧾 Found campaign:", campaign);

    if (!campaign) {
      console.warn("⚠️ Campaign not found");
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
      console.warn("🚫 Unauthorized update attempt by user:", req.user._id);
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
    if (title) {
      console.log("✏️ Updating title:", title);
      campaign.title = title;
    }
    if (description) {
      console.log("✏️ Updating description:", description);
      campaign.description = description;
    }
    if (date) {
      console.log("✏️ Updating date:", date);
      campaign.date = date;
    }
    if (location) {
      console.log("✏️ Updating location:", location);
      campaign.location = location;
    }

    await campaign.save();
    console.log("✅ Campaign updated successfully:", campaign);

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
    console.error("❌ Error updating campaign:", error);
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
  console.log("ENETERDD ENETERD");
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
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      hospital,
      search,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (hospital) {
      query.hospital = hospital;
    }
    console.log("📌 Query param - hospital:", hospital);

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    console.log("🔍 Search param - search:", search);

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    console.log("📅 Date filter - startDate:", startDate, "endDate:", endDate);
    console.log("🧾 Final query object:", query);

    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    const paginationOptions = {
      page,
      limit,
      sort: sortOptions,
      populate: [
        {
          path: "hospital",
          select: "name address isDeleted",
          match: {
            $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
          },
        },
        {
          path: "createdBy",
          select: "fullName email",
        },
        {
          path: "volunteers",
          select: "fullName email",
        },
      ],
    };

    console.log("📦 Pagination options:", paginationOptions);

    const {
      data: campaigns,
      totalCount,
      currentPage,
      totalPages,
    } = await paginate(Campaign, query, paginationOptions);

    const filteredCampaigns = campaigns.filter((c) => c.hospital);

    console.log("📊 Filtered campaigns length:", filteredCampaigns.length);
    console.log(
      "📈 Pagination result - totalCount:",
      totalCount,
      "currentPage:",
      currentPage,
      "totalPages:",
      totalPages
    );

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Campaigns retrieved successfully",
        data: {
          campaigns: filteredCampaigns.map((campaign) => campaign.toObject()),
          pagination: {
            totalCount,
            currentPage,
            totalPages,
          },
        },
        error: null,
      })
    );
  } catch (error) {
    console.error("❌ Error in getAllCampaigns:", error);
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
      const adminMessage = `New volunteer request for campaign: ${campaign.title}`;

      const notification = new Notification({
        user: hospitalAdmin._id,
        message: adminMessage,
        type: "campaign",
        relatedId: campaign._id,
      });

      await notification.save();
      console.log(
        `📩 Notification saved for hospital admin ${hospitalAdmin._id}`
      );

      const io = req.app.get("socketio");
      const hospitalAdminSocketId = onlineUsers.get(
        hospitalAdmin._id.toString()
      );

      if (hospitalAdminSocketId) {
        io.to(hospitalAdminSocketId).emit("campaign", {
          id: campaign._id,
          message: adminMessage,
          type: "campaign",
        });
        console.log(
          `📡 Real-time notification sent to hospital admin ${hospitalAdmin._id}`
        );
      } else {
        console.log(`💤 Hospital admin ${hospitalAdmin._id} is offline`);
      }
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
    const userMessage = `Your volunteer request for campaign "${campaign.title}" has been ${status}.`;

    const notification = new Notification({
      user: volunteerRequest.user,
      message: userMessage,
      type: "campaign",
      relatedId: campaign._id,
    });
    await notification.save();
    console.log(`📩 Notification saved for user ${volunteerRequest.user}`);

    // Emit real-time notification if user is online
    const io = req.app.get("socketio");
    const userSocketId = onlineUsers.get(volunteerRequest.user.toString());

    if (userSocketId) {
      // Changed: emit to user's room instead of socket ID
      io.to(volunteerRequest.user.toString()).emit("campaign", {
        id: campaign._id,
        message: userMessage,
        type: "campaign",
        createdAt: new Date().toISOString(),
      });
      console.log(
        `📡 Real-time notification sent to user ${volunteerRequest.user}`
      );
    } else {
      console.log(`💤 User ${volunteerRequest.user} is offline`);
    }

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
  console.log("Entered the get hospital volunteer requests");

  try {
    const { page, limit } = req.query;
    const hospitalId = req.user.hospital;
    console.log("The req.user is", req.user);
    console.log("Hospital ID from user:", hospitalId);

    if (!hospitalId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "Hospital ID not found for this admin",
      });
    }

    // Find campaigns associated with this hospital that have volunteer requests
    const result = await paginate(
      Campaign,
      {
        hospital: hospitalId,
        volunteerRequests: { $exists: true, $ne: [] },
      },
      {
        page,
        limit,
        sort: { "volunteerRequests.requestedAt": -1 },
        populate: [
          {
            path: "volunteerRequests.user",
            model: "User",
            select: "name email",
          },
          {
            path: "hospital",
            model: "Hospital",
            select: "name location",
          },
        ],
      }
    );
    console.log("The result is", result);

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Hospital volunteer requests retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching hospital volunteer requests:", error);
    next(error);
  }
};

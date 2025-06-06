import doctorModel from "../../models/doctor.model.js";
import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";

import mongoose from "mongoose";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import createResponse from "../../utils/responseBuilder.js";

// Backend message controller

export const getContactsForSidebar = async (req, res, next) => {
  try {
    console.log("Entering getContactsForSidebar function");

    const loggedInUserId = req.user._id;
    const loggedInUserRole = req.user.role;

    console.log("Logged-in User ID:", loggedInUserId);
    console.log("Logged-in User Role:", loggedInUserRole);

    let contacts = [];

    const { page = 1, limit = 10, search = "" } = req.query;

    if (loggedInUserRole === "user") {
      if (search.trim()) {
        console.log("User is searching for doctors...");

        const searchQuery = {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        };

        contacts = await doctorModel
          .find(searchQuery)
          .select("-password")
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit));

        console.log("Doctors found via search:", contacts.length);
      } else {
        console.log("Fetching recently messaged doctors...");

        const recentDoctorIds = await Message.aggregate([
          { $match: { senderId: loggedInUserId } },
          {
            $group: {
              _id: "$receiverId",
              lastMessageAt: { $max: "$createdAt" },
            },
          },
          { $sort: { lastMessageAt: -1 } },
          { $skip: (Number(page) - 1) * Number(limit) },
          { $limit: Number(limit) },
          {
            $lookup: {
              from: "doctors",
              localField: "_id",
              foreignField: "_id",
              as: "doctorInfo",
            },
          },
          { $unwind: "$doctorInfo" },
          {
            $project: {
              _id: "$doctorInfo._id",
              fullName: "$doctorInfo.fullName",
              email: "$doctorInfo.email",
              lastMessageAt: 1,
            },
          },
        ]);

        contacts = recentDoctorIds;
        console.log("Recent doctors fetched:", contacts.length);
      }
    } else if (loggedInUserRole === "doctor") {
      console.log("Fetching users who have messaged this doctor...");

      const userIds = await Message.distinct("senderId", {
        receiverId: loggedInUserId,
      });

      console.log("User IDs found who messaged the doctor:", userIds);

      if (userIds.length > 0) {
        const query = search.trim()
          ? {
              _id: { $in: userIds },
              $or: [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            }
          : { _id: { $in: userIds } };

        contacts = await User.find(query)
          .select("-password")
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit));

        console.log("Users fetched successfully:", contacts.length);
      } else {
        console.log("No users have messaged this doctor.");
      }
    }

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Contacts fetched successfully",
        data: contacts,
      })
    );
  } catch (error) {
    console.error("Error fetching contacts for sidebar:", error.message);
    console.error("Error stack trace:", error.stack);
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver ID" });
    }

    let imageUrl = null;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const newMessage = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const io = req.app.get("socketio");

    // Emit to both sender and receiver via rooms
    io.to(senderId.toString()).emit("message", {
      ...newMessage.toObject(),
      type: "message",
    });

    io.to(receiverId.toString()).emit("message", {
      ...newMessage.toObject(),
      type: "message",
    });

    // Update unread counts for both users
    const receiverUnread = await Message.countDocuments({
      senderId: senderId, // Only count messages from this sender
      receiverId: receiverId, // To this receiver
      read: false,
    });

    const senderUnread = await Message.countDocuments({
      senderId: receiverId, // Only count messages from the other user
      receiverId: senderId, // To the current user
      read: false,
    });
    // Update this in your sendMessage function
    io.to(receiverId.toString()).emit("chatCountUpdate", {
      chatId: senderId.toString(), // Add this line
      count: receiverUnread,
    });
    io.to(senderId.toString()).emit("chatCountUpdate", {
      chatId: receiverId.toString(), // Add this line
      count: senderUnread,
    });

    res.status(201).json({
      isSuccess: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    next(error);
  }
};

// Mark messages as read handler

export const markMessagesAsRead = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Missing required fields: senderId or receiverId",
        })
      );
    }

    // Fixed field names to be consistent with schema
    await Message.updateMany(
      {
        senderId: senderId,
        receiverId: receiverId,
        read: false,
      },
      { $set: { read: true } }
    );
    const io = req.app.get("socketio");
    io.to(senderId).emit("messages-read", { senderId, receiverId });

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Messages marked as read successfully",
      })
    );
  } catch (error) {
    console.error("Error marking messages as read:", error);
    next(error);
  }
};

// Get messages between two users
export const getMessages = async (req, res, next) => {
  console.log("\n===== START getMessages DEBUGGING =====");
  try {
    // 1. Log incoming parameters
    console.log("\n[1] Request Parameters:");
    console.log("req.params.id (otherUserId):", req.params.id);
    console.log("req.user._id (loggedInUserId):", req.user._id);

    const otherUserId = req.params.id;
    const loggedInUserId = req.user._id;

    // 2. Log the raw query being executed
    console.log("\n[2] Database Query:");
    console.log("Searching for messages between:", {
      loggedInUserId,
      otherUserId,
      query: {
        $or: [
          { senderId: loggedInUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: loggedInUserId },
        ],
      },
    });

    // 3. Execute query with additional debug
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean()
      .then((docs) => {
        console.log("\n[3] Raw Database Results (before transformation):");
        docs.forEach((doc) => {
          console.log(`Message ${doc._id}:`, {
            senderId: doc.senderId,
            senderType: typeof doc.senderId,
            receiverId: doc.receiverId,
            receiverType: typeof doc.receiverId,
            text:
              doc.text?.substring(0, 20) + (doc.text?.length > 20 ? "..." : ""),
          });
        });
        return docs.map((doc) => ({
          ...doc,
          senderId: doc.senderId?.toString(),
          receiverId: doc.receiverId?.toString(),
        }));
      });

    // 4. Log transformed results
    console.log("\n[4] Transformed Results (after toString()):");
    messages.forEach((msg) => {
      console.log(`Message ${msg._id}:`, {
        senderId: msg.senderId,
        senderType: typeof msg.senderId,
        receiverId: msg.receiverId,
        receiverType: typeof msg.receiverId,
        direction:
          msg.senderId === loggedInUserId.toString()
            ? "OUTGOING (from logged-in user)"
            : "INCOMING (to logged-in user)",
      });
    });

    // 5. Validate message directions
    const validation = {
      total: messages.length,
      outgoing: messages.filter((m) => m.senderId === loggedInUserId.toString())
        .length,
      incoming: messages.filter((m) => m.senderId !== loggedInUserId.toString())
        .length,
      invalid: messages.filter((m) => !m.senderId || !m.receiverId).length,
    };

    console.log("\n[5] Message Direction Validation:");
    console.log(validation);

    if (validation.invalid > 0) {
      console.error("\n[!] INVALID MESSAGES FOUND:");
      messages
        .filter((m) => !m.senderId || !m.receiverId)
        .forEach((msg) => {
          console.error("Invalid message:", {
            _id: msg._id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            createdAt: msg.createdAt,
          });
        });
    }

    // 6. Count unread messages
    const unreadCount = await Message.countDocuments({
      senderId: otherUserId,
      receiverId: loggedInUserId,
      read: false,
    });

    console.log("\n[6] Unread Count:", unreadCount);

    // 7. Mark as read
    const readUpdate = await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: loggedInUserId,
        read: false,
      },
      { $set: { read: true } }
    );

    console.log("\n[7] Marked as read:", {
      matched: readUpdate.matchedCount,
      modified: readUpdate.modifiedCount,
    });

    console.log("\n===== END getMessages DEBUGGING =====\n");

    res.status(200).json({
      isSuccess: true,
      data: { messages, unreadCount },
    });
  } catch (error) {
    console.error("\n[!!!] getMessages ERROR:", error);
    next(error);
  }
};

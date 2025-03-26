import doctorModel from "../../models/doctor.model.js";
import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";

import createResponse from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import mongoose from "mongoose";
import Notification from "../../models/notification.model.js";

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
      console.log("Fetching paginated doctors for the user...");

      // Fetch doctors matching search criteria, limited per page
      const query = search
        ? { fullName: { $regex: search, $options: "i" } }
        : {};
      console.log("Query to fetch doctors:", query);

      contacts = await doctorModel
        .find(query)
        .select("-password")
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      console.log("Doctors fetched:", contacts.length);
    } else if (loggedInUserRole === "doctor") {
      console.log("Fetching users who have messaged this doctor...");

      const userIds = await Message.distinct("senderId", {
        receiverId: loggedInUserId,
      });

      console.log("User IDs found who messaged the doctor:", userIds);

      if (userIds.length > 0) {
        contacts = await User.find({ _id: { $in: userIds } })
          .select("-password")
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit));
        console.log("Users fetched successfully:", contacts.length);
      } else {
        console.log("No users have messaged this doctor.");
      }
    }

    console.log("Final contacts to be sent:", contacts);

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

    console.log("Sending message from:", senderId, "to:", receiverId);

    let imageUrl = null;
    if (image) {
      console.log("Uploading image to Cloudinary...");
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
    }

    // Ensure field names match the schema
    const newMessage = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      text,
      image: imageUrl,
    });

    await newMessage.save();
    console.log("Message saved successfully:", newMessage);

    // ✅ **Save Notification to Database**
    const notification = new Notification({
      user: receiverId,
      message: `New message from ${req.user.fullName}: ${text || "📷 Image"}`,
      type: "message",
      relatedId: newMessage._id, // Link to message
    });

    await notification.save();
    console.log("Notification saved successfully");

    // ✅ **Emit Real-Time Notification via Socket.IO**
    const io = req.app.get("socketio");
    io.to(receiverId.toString()).emit("new-notification", {
      message: `New message from ${req.user.fullName}: ${text || "📷 Image"}`,
    });

    // ✅ **Emit Message via Socket.IO**
    io.to(receiverId).emit("newMessage", newMessage);

    res.status(201).json({
      isSuccess: true,
      statusCode: 201,
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

    await Message.updateMany(
      { sender: senderId, receiver: receiverId, read: false },
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
  console.log("Entering getMessages function");

  // Log req.params to check if it's defined
  console.log("req.params is", req.params);

  try {
    // Log req.params again inside the try block
    console.log("req.params inside try block is", req.params);

    // Extract otherUserId from req.params
    const { id: otherUserId } = req.params; // ID of the other user or doctor
    console.log("otherUserId extracted from req.params is", otherUserId);

    // Log req.user to check if it's defined
    console.log("req.user is", req.user);

    // Extract loggedInUserId from req.user
    const loggedInUserId = req.user._id; // ID of the logged-in user
    console.log("loggedInUserId extracted from req.user is", loggedInUserId);

    // Log the query being executed
    console.log("Fetching messages with query:", {
      $or: [
        { sender: loggedInUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: loggedInUserId },
      ],
    });

    // Fetch messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        {
          senderId: loggedInUserId,
          receiverId: new mongoose.Types.ObjectId(otherUserId),
        },
        {
          senderId: new mongoose.Types.ObjectId(otherUserId),
          receiverId: loggedInUserId,
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    // Log the fetched messages
    console.log("Fetched messages:", messages);

    // Send the response
    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Messages fetched successfully",
        data: messages,
      })
    );
  } catch (error) {
    // Log the error
    console.error("Error fetching messages:", error.message);
    console.error("Error stack trace:", error.stack);

    // Pass the error to the next middleware
    next(error);
  }
};

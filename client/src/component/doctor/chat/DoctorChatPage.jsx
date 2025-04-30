import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  keyframes,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CameraIcon, CheckCheck, FileText, Search, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMessageToState,
  handleGetContactsForSideBar,
  handleGetMessages,
  handleSendMessage,
  setCurrentChat,
  setImage,
  setNewMessage,
  updateContactWithLatestMessage,
} from "../../../features/messages/messageSlice";
import { useSocket } from "../../../hooks/useSocketNotification";

const DoctorChatPage = () => {
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);

  const bounce = keyframes`
    0%, 100% {
      transform: translateY(0);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-6px);
      opacity: 1;
    }
  `;

  const { contacts, messages, currentChat, newMessage, image, isLoading } =
    useSelector((state) => state.messageSlice);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef();

  const bgMessageOther = useColorModeValue("white", "gray.700");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const doctorId = useSelector((state) => state?.auth?.user?.data?._id);
  const { getSocket, onlineUsers } = useSocket();
  const socket = getSocket();

  console.log("🧠 Doctor ID:", doctorId);

  console.log("📡 Socket:", socket);
  const [localTypingUsers, setLocalTypingUsers] = useState({});

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (senderId) => {
      console.log("LOCAL typing handler: received from", senderId);
      setLocalTypingUsers((prev) => ({ ...prev, [senderId]: true }));
    };

    const handleStopTyping = (senderId) => {
      console.log("LOCAL stop typing handler: received from", senderId);
      setLocalTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[senderId];
        return newState;
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket]);

  // Send "typing" status to the server
  const sendTypingStatus = (receiverId) => {
    if (socket && socket.connected) {
      socket.emit("typing", { senderId: doctorId, receiverId });
    }
  };

  // Send "stop typing" status to the server
  const sendStopTypingStatus = (receiverId) => {
    if (socket && socket.connected) {
      socket.emit("stop-typing", { senderId: doctorId, receiverId });
    }
  };

  // Online/Typing indicators
  const isChatUserOnline = currentChat && onlineUsers.includes(currentChat._id);
  console.log("🔋 Chat user online?", isChatUserOnline);
  const isChatUserTyping = currentChat && localTypingUsers[currentChat._id];

  console.log("⏳ Chat user typing?", isChatUserTyping);

  // Fetch contacts for sidebar
  useEffect(() => {
    const getContacts = async () => {
      try {
        await dispatch(
          handleGetContactsForSideBar({ page, limit: 10, search })
        ).unwrap();
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };
    getContacts();
  }, [dispatch, page, search]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !doctorId) {
      console.warn("Socket or doctorId not available");
      return;
    }

    if (!socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }

    const handleIncomingMessage = (message) => {
      dispatch((dispatch, getState) => {
        const currentState = getState();
        const currentMessages = currentState?.messageSlice?.messages || [];
        const currentChat = currentState?.messageSlice?.currentChat;
        console.log("The current chat is", currentChat);
        console.log("The current chat id is", currentChat._id);
        const unreadCount = currentState?.messageSlice?.unreadCount || {};
        const isDuplicate = currentMessages.some(
          (msg) => msg._id === message._id
        );
        if (isDuplicate) return;

        dispatch(addNewMessageToState(message));
        dispatch(updateContactWithLatestMessage({ message, doctorId }));
      });
    };

    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, [currentChat?._id, doctorId, socket, dispatch]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (currentChat) dispatch(handleGetMessages(currentChat._id));
  }, [currentChat, dispatch]);

  // Handle sending messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !image) || !currentChat) return;

    try {
      setIsSending(true);
      const pendingMessage = newMessage;
      const pendingImage = image;
      dispatch(setNewMessage(""));
      setImagePreview(null);
      dispatch(setImage(null));

      if (currentChat) {
        console.log("if current chat :", currentChat);
        sendStopTypingStatus(currentChat._id);
      }

      await dispatch(
        handleSendMessage({
          receiverId: currentChat._id,
          text: pendingMessage,
          image: pendingImage,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Get patient display name
  const getDisplayName = (patient) => {
    if (patient?.fullName) {
      return patient?.fullName;
    }
    return patient?.fullName || "Unknown Patient";
  };
  // Typing handler
  const handleInputTyping = (e) => {
    const value = e.target.value;
    dispatch(setNewMessage(value));

    if (!currentChat || !socket) {
      console.warn("Cannot send typing - missing currentChat or socket");
      return;
    }

    console.log("💡 User typing, sending to:", currentChat._id);

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing status immediately
    sendTypingStatus(currentChat._id);

    // Set timeout to stop typing after 2s inactivity
    typingTimeoutRef.current = setTimeout(() => {
      console.log("⏱️ Auto-stop typing after inactivity");
      sendStopTypingStatus(currentChat._id);
    }, 3000);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        dispatch(setImage(reader.result));
        dispatch(setImagePreview(reader.result));
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Flex
      h="calc(100vh - 120px)"
      bg="gray.50"
      className="shadow-sm border-gray-100 border-2"
    >
      <Box
        w="320px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        className="bg-white shadow-md rounded-lg"
      >
        <Box p={5} borderBottom="1px" borderColor="gray.200">
          <Heading
            size="lg"
            color="gray.700"
            className="font-semibold text-gray-800 mb-2"
          >
            Patient Chats
          </Heading>
          <Box mt={4} position="relative">
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pl={10}
              borderRadius="full"
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search
              size={18}
              color="gray.400"
              className="absolute left-3 top-3"
            />
          </Box>
        </Box>

        <Box className="max-h-[calc(100vh-250px)] overflow-y-auto">
          {filteredContacts?.map((contact) => {
            const isOnline = onlineUsers?.includes(contact._id);

            return (
              <Box key={contact._id}>
                <Flex
                  p={4}
                  cursor="pointer"
                  alignItems="center"
                  className={`
            transition duration-200 ease-in-out
            ${
              currentChat?._id === contact._id
                ? "bg-blue-50 hover:bg-blue-100"
                : "hover:bg-gray-100"
            }
          `}
                  onClick={() => dispatch(setCurrentChat(contact))}
                >
                  <Avatar
                    name={getDisplayName(contact)}
                    bg="blue.500"
                    color="white"
                    size="md"
                    className={`ring-2 ${
                      isOnline ? "ring-green-500" : "ring-gray-300"
                    }`}
                  />
                  <Box ml={3} flex="1" overflow="hidden">
                    <Flex justify="space-between" align="center">
                      <Text
                        fontWeight="semibold"
                        color="gray.800"
                        className="text-gray-900 font-medium truncate"
                      >
                        {getDisplayName(contact)}
                      </Text>
                      {isOnline && (
                        <Badge colorScheme="green" ml={2} fontSize="xs">
                          Online
                        </Badge>
                      )}
                    </Flex>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      className="text-gray-500 truncate"
                    >
                      {isChatUserTyping ? (
                        <span className="text-blue-500 italic">Typing...</span>
                      ) : contact.role === "Patient" ? (
                        "Patient"
                      ) : (
                        "Doctor"
                      )}
                    </Text>
                  </Box>
                </Flex>
                <Divider borderColor="gray.200" />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Chat area */}
      <Flex flex="1" direction="column" className="bg-gray-50 rounded-r-lg">
        {currentChat ? (
          <>
            {/* Chat header */}
            <Flex
              p={4}
              bg="white"
              borderBottom="1px"
              borderColor="gray.200"
              alignItems="center"
              className="shadow-sm rounded-tr-lg"
            >
              <Flex alignItems="center">
                <Avatar
                  name={getDisplayName(currentChat)}
                  bg="blue.500"
                  color="white"
                  size="md"
                  className="ring-2 ring-blue-300"
                />
                <Box ml={3}>
                  <Text
                    fontWeight="semibold"
                    color="gray.800"
                    className="text-gray-900 font-medium"
                  >
                    {getDisplayName(currentChat)}
                  </Text>
                  <Flex align="center">
                    <Text
                      fontSize="sm"
                      color={isChatUserTyping ? "green.500" : "blackAlpha.200"}
                    >
                      {isChatUserTyping
                        ? "Typing..."
                        : currentChat.role === "Doctor"}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <IconButton
                aria-label="View Files"
                icon={<FileText size={20} />}
                variant="ghost"
                colorScheme="blue"
                className="hover:bg-blue-50 transition duration-300"
              />
            </Flex>

            {/* Messages Container */}
            <Box
              flex="1"
              p={4}
              overflowY="auto"
              className="bg-gray-50 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
            >
              {isLoading ? (
                <Flex justify="center" align="center" h="full">
                  <Spinner color="blue.500" />
                  <Text ml={2} color="gray.600">
                    Loading messages...
                  </Text>
                </Flex>
              ) : (
                <Flex direction="column" gap={4}>
                  {/* Messages List */}
                  {messages.length === 0 ? (
                    <Flex justify="center" align="center" h="200px">
                      <Text color="gray.500">
                        No messages yet. Start the conversation!
                      </Text>
                    </Flex>
                  ) : (
                    messages.map((message, index) => {
                      const isMine =
                        message.senderId === doctorId ||
                        message.senderId?._id === doctorId;
                      const isLastMessage = index === messages.length - 1;

                      return (
                        <Flex
                          key={message._id || `msg-${index}`}
                          justify={isMine ? "flex-end" : "flex-start"}
                          ref={isLastMessage ? scrollRef : undefined}
                        >
                          <Box
                            maxW={{ base: "70%", md: "xs" }}
                            borderRadius="xl"
                            px={4}
                            py={2}
                            bg={isMine ? "blue.500" : "white"}
                            color={isMine ? "white" : "gray.800"}
                            boxShadow="md"
                            position="relative"
                          >
                            {/* Message text */}
                            {message.text && (
                              <Text
                                mb={message.image ? 2 : 0}
                                className="text-sm"
                              >
                                {message.text}
                              </Text>
                            )}

                            {/* Image attachment */}
                            {message.image && (
                              <Box
                                mt={message.text ? 2 : 0}
                                borderRadius="md"
                                overflow="hidden"
                                className="hover:scale-105 transition duration-300"
                              >
                                <img
                                  src={message.image}
                                  alt="Message attachment"
                                  className="max-h-60 w-auto rounded-lg"
                                  loading="lazy"
                                />
                              </Box>
                            )}

                            {/* Message metadata */}
                            <Flex
                              justify="flex-end"
                              align="center"
                              fontSize="xs"
                              mt={1}
                              color={isMine ? "blue.100" : "gray.500"}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                              {isMine && (
                                <Box ml={1} display="inline-flex">
                                  <CheckCheck
                                    size={16}
                                    opacity={message.read ? 1 : 0.5}
                                  />
                                </Box>
                              )}
                            </Flex>
                          </Box>
                        </Flex>
                      );
                    })
                  )}

                  {/* Typing indicator */}
                  {isChatUserTyping && (
                    <Flex align="center" ml={10} mb={2}>
                      <Box
                        bg={bgMessageOther}
                        py={2}
                        px={4}
                        borderRadius="xl"
                        display="inline-flex"
                        alignItems="center"
                        boxShadow="sm"
                      >
                        <Flex
                          direction="column"
                          align="flex-start"
                          justify="center"
                        >
                          <Text fontSize="sm" color={textSecondary} mb={1}>
                            {currentChat.fullName.split(" ")[0]} is typing...
                          </Text>
                          <Flex gap="6px">
                            {[0, 1, 2].map((_, i) => (
                              <Box
                                key={i}
                                w="8px"
                                h="8px"
                                borderRadius="full"
                                bg={textSecondary}
                                animation={`${bounce} 1.4s infinite`}
                                animationDelay={`${i * 0.2}s`}
                              />
                            ))}
                          </Flex>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              )}
            </Box>

            {/* Image preview */}
            {imagePreview && (
              <Box
                p={2}
                bg="gray.100"
                borderTop="1px"
                borderColor="gray.200"
                className="rounded-b-lg"
              >
                <Box position="relative" display="inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-auto rounded-lg"
                  />
                  <IconButton
                    icon={<Text>×</Text>}
                    size="xs"
                    colorScheme="red"
                    isRound
                    position="absolute"
                    top={-2}
                    right={-2}
                    onClick={() => {
                      dispatch(setImage(null));
                      dispatch(setImagePreview(null));
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Message input */}
            <Flex
              as="form"
              onSubmit={handleSubmit}
              p={4}
              bg="white"
              borderTop="1px"
              borderColor="gray.200"
              align="center"
              className="rounded-br-lg"
            >
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <IconButton
                as="label"
                htmlFor="image-upload"
                aria-label="Upload image"
                icon={<CameraIcon size={20} />}
                variant="ghost"
                borderRadius="full"
                cursor="pointer"
                className="hover:bg-gray-200 transition duration-300"
              />
              <Input
                placeholder="Type a message..."
                value={newMessage}
                // onChange={(e) => dispatch(setNewMessage(e.target.value))}
                onChange={handleInputTyping}
                ml={2}
                mr={2}
                borderRadius="full"
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <IconButton
                type="submit"
                colorScheme="blue"
                aria-label="Send message"
                icon={<Send size={18} />}
                isDisabled={!newMessage.trim() && !image}
                borderRadius="full"
                className="hover:bg-blue-600 transition duration-300"
              />
            </Flex>
          </>
        ) : (
          <Flex
            flex="1"
            direction="column"
            justify="center"
            align="center"
            bg="gray.50"
            className="rounded-r-lg"
          >
            <Heading
              size="lg"
              color="gray.700"
              className="text-gray-800 font-bold mb-3"
            >
              Welcome to Patient Chat
            </Heading>
            <Text mt={2} color="gray.500" className="text-gray-600">
              Select a patient to start chatting
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default DoctorChatPage;

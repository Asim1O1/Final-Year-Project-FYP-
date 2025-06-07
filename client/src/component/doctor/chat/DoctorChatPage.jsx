import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CameraIcon, CheckCheck, FileText, Search, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewContact,
  addNewMessageToState,
  handleGetContactsForSideBar,
  handleGetMessages,
  handleSendMessage,
  reorderContactsAfterNewMessage,
  setCurrentChat,
  setImage,
  setImagePreview,
  setNewMessage,
  updateContactWithLatestMessage,
} from "../../../features/messages/messageSlice";
import { useSocket } from "../../../hooks/useSocketNotification";

const DoctorChatPage = () => {
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);
  const toast = useToast(); // Added toast for error handling

  // Animation keyframe
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

  // Selector optimized with destructuring and nullish coalescing
  const {
    contacts = [],
    messages = [],
    currentChat,
    newMessage = "",
    image,
    isLoading,
    imagePreview,

    typingUsers = {},
  } = useSelector((state) => state.messageSlice);

  // Local state
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // Track connection state

  // Refs
  const messagesEndRef = useRef();

  const reconnectTimeoutRef = useRef(null);

  // Style values
  const bgMessageOther = useColorModeValue("white", "gray.700");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  // Selectors
  const doctorId = useSelector((state) => state?.auth?.user?.data?._id);
  const { getSocket, onlineUsers = [] } = useSocket();
  const socket = getSocket();

  // Memoized values for better performance
  const isChatUserOnline = useMemo(
    () => currentChat && onlineUsers.includes(currentChat._id),
    [currentChat, onlineUsers]
  );
  console.log("Is chat user online:", isChatUserOnline);

  const isChatUserTyping = useMemo(() => {
    // Debug logs
    console.log("Current chat ID:", currentChat?._id);
    console.log("Redux typing users:", typingUsers); // Log Redux state instead

    // Return boolean value using the Redux state
    return Boolean(
      currentChat && currentChat._id && typingUsers[currentChat._id]
    );
  }, [currentChat, typingUsers]); // Use typingUsers from Redux
  console.log("Is chat user typing:", isChatUserTyping);

  const filteredContacts = useMemo(
    () =>
      contacts.filter((contact) =>
        (contact.fullName || "")
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase())
      ),
    [contacts, searchTerm]
  );

  // Memoized getDisplayName function
  const getDisplayName = useCallback((patient) => {
    if (patient?.fullName) {
      return patient.fullName;
    }
    return "Unknown Patient";
  }, []);

  // Typing status handlers - memoized to prevent recreating on every render
  const sendTypingStatus = useCallback(
    (receiverId) => {
      if (socket && socket.connected && receiverId) {
        console.log("Sending typing status to:", receiverId);
        socket.emit("typing", { senderId: doctorId, receiverId });
      }
    },
    [socket, doctorId]
  );

  const sendStopTypingStatus = useCallback(
    (receiverId) => {
      if (socket && socket.connected && receiverId) {
        console.log("Sending stop typing status to:", receiverId);
        socket.emit("stop-typing", { senderId: doctorId, receiverId });
      }
    },
    [socket, doctorId]
  );

  // Enhanced socket connection management with reconnection strategy
  useEffect(() => {
    if (!socket || !doctorId) {
      console.warn("Socket or doctorId not available");
      return;
    }

    // Connection state handlers
    const handleConnect = () => {
      console.log("Socket connected successfully");
      setConnectionStatus("connected");
      // Clear any reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const handleDisconnect = (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      setConnectionStatus("disconnected");
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
      setConnectionStatus("error");

      // Implement exponential backoff for reconnections
      const reconnectTime = connectionStatus === "error" ? 10000 : 5000;

      // Clear any existing reconnection attempt
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Schedule reconnection
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect socket...");
        if (socket) socket.connect();
      }, reconnectTime);
    };

    // Try to connect if not already connected
    if (!socket.connected) {
      console.log("Socket not connected, attempting to connect");
      socket.connect();
    }

    // Add event listeners for connection state
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Message handler with functional update pattern to prevent race conditions
    // Enhance your handleIncomingMessage function
    const handleIncomingMessage = (message) => {
      console.log("Received message:", message);

      dispatch(async (dispatch, getState) => {
        const currentState = getState();
        const currentMessages = currentState?.messageSlice?.messages || [];
        const currentContacts = currentState?.messageSlice?.contacts || [];

        // Prevent duplicate messages
        const isDuplicate = currentMessages.some(
          (msg) => msg._id === message._id
        );
        if (isDuplicate) {
          console.log("Duplicate message detected, ignoring");
          return;
        }

        // Process the message
        dispatch(addNewMessageToState(message));

        // Get sender ID (handle both object and string ID formats)
        const senderId =
          typeof message.senderId === "object"
            ? message.senderId._id
            : message.senderId;

        // Check if this sender is already in our contacts
        const contactExists = currentContacts.some(
          (contact) => contact._id === senderId
        );

        if (contactExists) {
          // If contact exists, update with latest message
          dispatch(updateContactWithLatestMessage({ message, doctorId }));

          // Move this contact to the top of the list
          dispatch(reorderContactsAfterNewMessage(senderId));
        } else {
          // If contact doesn't exist, fetch and add them
          console.log("New contact detected, fetching details");
          dispatch(addNewContact(senderId));
        }
      });
    };

    socket.on("message", handleIncomingMessage);

    // Clean up all event listeners and timeouts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("message", handleIncomingMessage);

      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [doctorId, socket, dispatch]); // Removed currentChat._id dependency to prevent excessive re-renders

  // Fetch contacts with error handling
  useEffect(() => {
    const getContacts = async () => {
      try {
        await dispatch(
          handleGetContactsForSideBar({ page, limit: 10, search })
        ).unwrap();
      } catch (err) {
        console.error("Error fetching contacts:", err);
        toast({
          title: "Failed to load contacts",
          description: "Please check your connection and try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    getContacts();
  }, [dispatch, page, search, toast]);

  // Fetch messages when chat changes with error handling
  useEffect(() => {
    if (!currentChat) return;

    const fetchMessages = async () => {
      try {
        await dispatch(handleGetMessages(currentChat._id)).unwrap();
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast({
          title: "Failed to load messages",
          description: "Could not retrieve conversation history",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };

    fetchMessages();
  }, [currentChat, dispatch, toast]);

  // Handle message submission with robust error handling and recovery

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if ((!newMessage.trim() && !image) || !currentChat) return;
      // Store a copy of the current values before clearing
      const textToSend = newMessage;
      const imageToSend = image;

      try {
        setIsSending(true);

        // Clear input immediately for better UX
        dispatch(setNewMessage(""));
        dispatch(setImage(null));

        dispatch(setImagePreview(null));

        // Stop typing indicators
        if (currentChat) {
          sendStopTypingStatus(currentChat._id);
        }

        await dispatch(
          handleSendMessage({
            receiverId: currentChat._id,
            text: textToSend, // Use the variable we defined above
            image: imageToSend, // Use the variable we defined above
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to send:", err);

        // Show error to user
        toast({
          title: "Message not sent",
          description:
            "There was a problem sending your message. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        // Restore message content that failed to send
        // Use the SAME variable names as in the try block
        dispatch(setNewMessage(textToSend));
        if (imageToSend) {
          dispatch(setImage(imageToSend));
          // Same issue here - skip if not sure
          // dispatch(setImagePreview(imageToSend));
        }
      } finally {
        setIsSending(false);
      }
    },
    [newMessage, image, currentChat, dispatch, sendStopTypingStatus, toast]
  );

  // Optimized typing handler with debounce
  const handleInputTyping = useCallback(
    (e) => {
      const value = e.target.value;
      dispatch(setNewMessage(value));

      if (!currentChat || !socket) {
        console.warn("Cannot send typing - missing currentChat or socket");
        return;
      }

      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing status immediately
      sendTypingStatus(currentChat._id);

      // Set timeout to stop typing after inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTypingStatus(currentChat._id);
      }, 3000);
    },
    [currentChat, socket, dispatch, sendTypingStatus, sendStopTypingStatus]
  );

  // Optimized image upload handler
  const handleImageChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image under 5MB",
            status: "warning",
            duration: 3000,
          });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(setImage(reader.result));
          // Fix: Use dispatch with the proper action
          dispatch(setImagePreview(reader.result)); // Assuming your action is named like this
        };
        reader.onerror = () => {
          toast({
            title: "Error reading file",
            description: "Please try another image",
            status: "error",
            duration: 3000,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [dispatch, toast]
  );

  // Improved scroll behavior for messages
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (messages.length > 0) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
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
            const isTyping = typingUsers[contact._id]; // Check if this contact is typing

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
                      color={isTyping ? "blue.500" : "gray.500"}
                      className={
                        isTyping ? "text-blue-500 italic" : "text-gray-500"
                      }
                      noOfLines={1}
                    >
                      {isTyping
                        ? "Typing..."
                        : contact.role === "Patient"
                        ? "Patient"
                        : "Patient"}
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
              <Flex alignItems="center" flex="1">
                <Avatar
                  name={getDisplayName(currentChat)}
                  bg="blue.500"
                  color="white"
                  size="md"
                  className={`ring-2 ${
                    isChatUserOnline ? "ring-green-500" : "ring-gray-300"
                  }`}
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
                    {/* FIX: Correctly show typing status or online/role status */}
                    <Text
                      fontSize="sm"
                      color={isChatUserTyping ? "green.500" : "gray.500"}
                    >
                      {isChatUserTyping
                        ? "Typing..."
                        : isChatUserOnline
                        ? "Online"
                        : currentChat.role || "Patient"}
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
                          ref={isLastMessage ? messagesEndRef : undefined}
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
                            {currentChat?.fullName?.split(" ")?.[0] ||
                              "Patient"}{" "}
                            is typing...
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
                  <div ref={messagesEndRef} />
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
                isDisabled={(!newMessage.trim() && !image) || isSending}
                isLoading={isSending}
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

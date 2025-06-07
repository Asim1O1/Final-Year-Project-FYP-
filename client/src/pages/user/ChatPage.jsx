import { keyframes } from "@emotion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CheckCheck, Paperclip, Search, Send, X } from "lucide-react";

import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  addNewMessageToState,
  clearUnreadCountForChat,
  handleGetContactsForSideBar,
  handleGetMessages,
  handleMarkMessagesAsRead,
  handleSendMessage,
  setCurrentChat,
  setImage,
  setImagePreview,
  setNewMessage,
  updateContactWithLatestMessage,
  updateUnreadCount,
} from "../../features/messages/messageSlice";
import { useSocket } from "../../hooks/useSocketNotification";

const ChatPage = () => {
  // Make sure all hooks are called unconditionally at the top level
  const dispatch = useDispatch();

  // All useState calls
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // All useRef calls
  const scrollRef = useRef();
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

  // All useSelector calls
  const contacts = useSelector((state) => state.messageSlice.contacts);
  const messages = useSelector((state) => state.messageSlice.messages);
  const currentChat = useSelector((state) => state.messageSlice.currentChat);
  console.log("The currnt chat is", currentChat);
  const newMessage = useSelector((state) => state.messageSlice.newMessage);
  const image = useSelector((state) => state.messageSlice.image);
  const imagePreview = useSelector((state) => state.messageSlice.imagePreview);
  const isLoading = useSelector((state) => state.messageSlice.isLoading);
  const user = useSelector((state) => state?.auth?.user?.data);

  const userId = user?._id;
  const {
    getSocket,
    typingUsers,
    onlineUsers,
    sendStopTypingStatus,
    sendTypingStatus,
  } = useSocket();
  const socket = getSocket();
  console.log("🧠 User ID:", userId);
  console.log("🌐 Online users:", onlineUsers);
  console.log("✍️ Typing users:", typingUsers);
  console.log("📡 Socket:", socket);

  // Online/Typing indicators
  const isChatUserOnline = useMemo(
    () => currentChat && onlineUsers.includes(currentChat._id),
    [currentChat, onlineUsers]
  );

  const isChatUserTyping = useMemo(
    () => currentChat && typingUsers[currentChat._id],
    [currentChat, typingUsers]
  );

  // Chakra color mode values
  const bgMain = useColorModeValue("gray.50", "gray.900");
  const bgSidebar = useColorModeValue("white", "gray.800");
  const bgMessage = useColorModeValue("blue.500", "blue.400");
  const bgMessageOther = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  console.log("The messages is", messages);
  console.log("The socket is", socket);

  // Fetch contacts
  useEffect(() => {
    const getContacts = async () => {
      try {
        console.log("🔎 Fetching contacts for sidebar...");
        await dispatch(
          handleGetContactsForSideBar({ page, limit: 10, search })
        ).unwrap();
      } catch (err) {
        console.error("❌ Error fetching contacts:", err);
      }
    };
    getContacts();
  }, [dispatch, page, search]);

  // Memoize event handlers with useCallback
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);
  // Socket.io setup
  useEffect(() => {
    // Make sure we always check for socket and userId before proceeding
    if (!socket || !userId) {
      console.warn("No socket or user ID found, skipping socket setup");
      return;
    }

    if (!socket.connected) {
      console.log("Socket not connected, trying to connect");
      socket.connect();
    }

    console.log("Setting up socket listeners for user:", userId);

    const handleIncomingMessage = (message) => {
      console.log("Received message:", message);

      // Get latest messages from state rather than using stale closure
      dispatch((dispatch, getState) => {
        const currentState = getState();
        const currentMessages = currentState?.messageSlice?.messages || [];
        const currentChat = currentState?.messageSlice?.currentChat;
        const unreadCount = currentState?.messageSlice?.unreadCount || {};

        console.log("The curretnt chat is", currentChat);

        // Check if we already have this message in state
        const isDuplicate = currentMessages.some(
          (msg) => msg._id === message._id
        );

        if (isDuplicate) {
          console.log("Duplicate message detected, ignoring");
          return; // Return state unchanged
        }

        dispatch(addNewMessageToState(message));

        dispatch(updateContactWithLatestMessage({ message, userId }));

        if (
          message.receiverId === userId &&
          (!currentChat || currentChat._id !== message.senderId) &&
          !message.read
        ) {
          const previousCount = unreadCount[message.senderId] || 0;
          dispatch(
            updateUnreadCount({
              chatId: message.senderId,
              count: previousCount + 1,
            })
          );
        }
      });
    };

    const handleUnreadCountUpdate = ({ chatId, count }) => {
      dispatch(updateUnreadCount({ chatId, count }));
    };

    // Rest of the code remains the same
    const handleMessagesRead = ({ senderId, receiverId }) => {
      if (userId === senderId) {
        dispatch(handleMarkMessagesAsRead({ senderId, receiverId }));
      }
    };

    // Add event listeners
    socket.on("message", handleIncomingMessage);
    socket.off("chatCountUpdate", handleUnreadCountUpdate);
    socket.on("messages-read", handleMessagesRead);
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup function
    return () => {
      socket.off("message", handleIncomingMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("connect_error");
    };
  }, [currentChat, dispatch, userId, socket]);

  // Fetch messages when changing chat
  useEffect(() => {
    if (!currentChat) return;
    dispatch(handleGetMessages(currentChat._id));
  }, [currentChat, dispatch]);

  // Handle sending messages
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if ((!newMessage.trim() && !image) || !currentChat || !socket) return;

      try {
        setIsSending(true);
        // Save current message state to variables
        const pendingText = newMessage;
        const pendingImage = image;

        // Clear input immediately but don't add to state yet
        dispatch(setNewMessage(""));
        dispatch(setImage(null));
        dispatch(setImagePreview(null));

        // Send stop typing event when message is sent
        if (currentChat) {
          sendStopTypingStatus(currentChat._id);
        }

        await dispatch(
          handleSendMessage({
            receiverId: currentChat._id,
            text: pendingText,
            image: pendingImage,
          })
        ).unwrap();

        // The socket event will handle adding the message to state
      } catch (err) {
        console.error("Error sending message:", err);
      } finally {
        setIsSending(false);
      }
    },
    [newMessage, image, currentChat, socket, sendStopTypingStatus, dispatch]
  );
  // Typing handler
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

      // Set timeout to stop typing after 2s inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTypingStatus(currentChat._id);
      }, 3000);
    },
    [currentChat, socket, dispatch, sendTypingStatus, sendStopTypingStatus]
  );
  // In your chat page component
  // Replace your existing useEffect for clearing unread counts
  useEffect(() => {
    // Skip if there's no current chat
    if (!currentChat || !currentChat._id || !userId) return;

    console.log("Clearing unread count for chat:", currentChat._id);

    // Clear unread count in Redux
    dispatch(clearUnreadCountForChat(currentChat._id));

    // Mark messages as read in the backend
    dispatch(
      handleMarkMessagesAsRead({
        senderId: currentChat._id,
        receiverId: userId,
      })
    );

    // This is important: Also emit a socket event to tell the server
    if (socket && socket.connected) {
      socket.emit("mark_messages_read", {
        chatId: currentChat._id,
        userId: userId,
      });
    }
  }, [currentChat, userId, dispatch, socket]); // Simplified dependencies // Change to use optional chaining

  // Handle image upload
  const handleImageChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          dispatch(setImage(reader.result));
          dispatch(setImagePreview(reader.result));
        };

        reader.readAsDataURL(file);
      }
    },
    [dispatch]
  );
  // Auto scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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
      bg={bgMain}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
    >
      {/* Contacts sidebar */}
      <Box
        w={{ base: "100%", md: "350px" }}
        bg={bgSidebar}
        borderRight="1px"
        borderColor={borderColor}
        display={{ base: currentChat ? "none" : "block", md: "block" }}
      >
        <Box p={5} borderBottom="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color={textPrimary} fontWeight="bold">
              Messages
            </Heading>
          </Flex>

          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search doctors..."
              value={search}
              onChange={handleSearchChange}
              bg={inputBg}
              borderRadius="full"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
              }}
            />
            {search && (
              <InputRightElement>
                <IconButton
                  icon={<X size={14} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => handleSearchChange({ target: { value: "" } })}
                  aria-label="Clear search"
                  borderRadius="full"
                />
              </InputRightElement>
            )}
          </InputGroup>
        </Box>

        {isLoading ? (
          <Flex justify="center" p={6} direction="column" align="center">
            <Spinner color="blue.500" size="lg" mb={3} />
            <Text color={textSecondary}>Loading conversations...</Text>
          </Flex>
        ) : (
          <Box
            className="contacts-container"
            overflowY="auto"
            maxH="calc(100vh - 250px)"
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--chakra-colors-gray-300)",
                borderRadius: "20px",
              },
            }}
          >
            {contacts?.length === 0 ? (
              <Flex justify="center" align="center" p={6} direction="column">
                <Text color={textSecondary} textAlign="center">
                  No conversations found
                </Text>
              </Flex>
            ) : (
              contacts?.map((contact) => {
                // Fix the online status check
                const isOnline = onlineUsers.includes(contact._id);
                const isTyping = typingUsers[contact._id];

                console.log("The is typing is", isTyping);
                return (
                  <Box
                    key={contact._id}
                    transition="all 0.2s"
                    bg={
                      currentChat?._id === contact._id
                        ? highlightBg
                        : "transparent"
                    }
                    _hover={{
                      bg:
                        currentChat?._id === contact._id
                          ? highlightBg
                          : useColorModeValue("gray.100", "gray.700"),
                    }}
                    borderLeft="3px solid"
                    borderLeftColor={
                      currentChat?._id === contact._id
                        ? "blue.500"
                        : "transparent"
                    }
                  >
                    <Flex
                      p={4}
                      cursor="pointer"
                      alignItems="center"
                      onClick={() => dispatch(setCurrentChat(contact))}
                      position="relative"
                    >
                      <Box position="relative">
                        <Avatar
                          name={contact.fullName}
                          color="white"
                          size="md"
                          boxShadow="sm"
                        />
                        {isOnline && (
                          <Box
                            position="absolute"
                            bottom="2px"
                            right="2px"
                            w="12px"
                            h="12px"
                            bg="green.400"
                            borderRadius="full"
                            border="2px solid"
                            borderColor={bgSidebar}
                          />
                        )}
                      </Box>

                      <Box ml={3} flex="1">
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <Text
                              fontWeight="semibold"
                              color={textPrimary}
                              fontSize="md"
                            >
                              {contact.fullName}
                            </Text>
                            {isOnline && (
                              <Text
                                ml={2}
                                fontSize="xs"
                                color="green.400"
                                fontWeight="medium"
                              >
                                Active
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                      </Box>
                    </Flex>
                    <Divider borderColor={borderColor} opacity={0.6} />
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </Box>

      {/* Chat area */}
      <Flex
        flex="1"
        direction="column"
        display={{ base: !currentChat ? "none" : "flex", md: "flex" }}
      >
        {currentChat ? (
          <>
            {/* Chat header */}
            <Flex
              p={4}
              bg={bgSidebar}
              borderBottom="1px"
              borderColor={borderColor}
              alignItems="center"
              justify="space-between"
            >
              <Flex align="center">
                <Avatar
                  name={currentChat.fullName}
                  bg="blue.500"
                  color="white"
                  size="md"
                ></Avatar>

                <Box ml={3}>
                  <Text fontWeight="semibold" color={textPrimary}>
                    {currentChat.fullName}
                  </Text>
                  <Flex align="center">
                    <Text fontSize="sm" color={textSecondary}>
                      {isChatUserTyping
                        ? "Typing..."
                        : currentChat.role === "Doctor"}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Flex>

            {/* Messages area */}
            <Box
              flex="1"
              p={4}
              overflowY="auto"
              bg={bgMain}
              css={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "var(--chakra-colors-gray-300)",
                  borderRadius: "20px",
                },
              }}
            >
              {isLoading ? (
                <Flex
                  justify="center"
                  align="center"
                  h="full"
                  direction="column"
                >
                  <Spinner color="blue.500" size="xl" mb={4} />
                  <Text color={textSecondary}>
                    Loading conversation history...
                  </Text>
                </Flex>
              ) : messages.length === 0 ? (
                <Flex
                  justify="center"
                  align="center"
                  h="full"
                  direction="column"
                >
                  <Text color={textSecondary} mb={2}>
                    No messages yet
                  </Text>
                  <Text fontSize="sm" color={textSecondary}>
                    Start the conversation by sending a message
                  </Text>
                </Flex>
              ) : (
                <Flex direction="column" gap={4}>
                  {/* Date separator */}
                  <Flex align="center" justify="center" my={4}>
                    <Divider flex="1" borderColor={borderColor} />
                    <Text
                      mx={4}
                      fontSize="xs"
                      color={textSecondary}
                      fontWeight="medium"
                    >
                      Today
                    </Text>
                    <Divider flex="1" borderColor={borderColor} />
                  </Flex>

                  {messages.map((message, index) => {
                    const isMine =
                      (message.senderId?._id === userId ||
                        message.senderId === userId) &&
                      !(
                        message.receiverId?._id === userId ||
                        message.receiverId === userId
                      );

                    // Group consecutive messages from the same sender
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1].senderId !== message.senderId;

                    return (
                      <Flex
                        key={`${message._id}-${index}`}
                        justify={isMine ? "flex-end" : "flex-start"}
                        ref={scrollRef}
                        mb={2}
                      >
                        {!isMine && showAvatar && (
                          <Avatar
                            name={currentChat.fullName}
                            bg="blue.500"
                            color="white"
                            size="sm"
                            mr={2}
                            mt={1}
                          />
                        )}

                        {!isMine && !showAvatar && <Box w="32px" mr={2} />}

                        <Box
                          maxW="65%"
                          borderRadius={
                            isMine ? "2xl 2xl 0 2xl" : "2xl 2xl 2xl 0"
                          }
                          px={4}
                          py={3}
                          bg={isMine ? bgMessage : bgMessageOther}
                          color={isMine ? "white" : textPrimary}
                          boxShadow="sm"
                        >
                          {message?.text && (
                            <Text mb={message.image ? 2 : 0} fontSize="md">
                              {message?.text}
                            </Text>
                          )}

                          {message.image && (
                            <Box
                              mt={2}
                              borderRadius="md"
                              overflow="hidden"
                              transition="transform 0.2s"
                              _hover={{ transform: "scale(1.02)" }}
                              cursor="pointer"
                            >
                              <img
                                src={message.image || "/placeholder.svg"}
                                alt="Message attachment"
                                style={{
                                  maxHeight: "200px",
                                  width: "auto",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                          )}

                          <Flex
                            justify="flex-end"
                            fontSize="xs"
                            mt={1}
                            color={isMine ? "whiteAlpha.800" : textSecondary}
                            align="center"
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            {isMine && (
                              <Box ml={1}>
                                <CheckCheck
                                  size={14}
                                  opacity={message.read ? 1 : 0.5}
                                  color={
                                    message.read ? "white" : "whiteAlpha.800"
                                  }
                                />
                              </Box>
                            )}
                          </Flex>
                        </Box>
                      </Flex>
                    );
                  })}

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
                p={3}
                bg={useColorModeValue("gray.100", "gray.700")}
                borderTop="1px"
                borderColor={borderColor}
              >
                <Box position="relative" display="inline-block">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    style={{
                      height: "60px",
                      width: "auto",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    icon={<X size={12} />}
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
                    boxShadow="md"
                  />
                </Box>
              </Box>
            )}

            {/* Message input */}
            <Flex
              as="form"
              onSubmit={handleSubmit}
              p={4}
              bg={bgSidebar}
              borderTop="1px"
              borderColor={borderColor}
              align="center"
            >
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <Tooltip label="Attach files" placement="top">
                <IconButton
                  as="label"
                  htmlFor="image-upload"
                  aria-label="Upload image"
                  icon={<Paperclip size={20} />}
                  variant="ghost"
                  borderRadius="full"
                  cursor="pointer"
                  colorScheme="blue"
                  mr={1}
                />
              </Tooltip>

              <InputGroup size="md">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  // onChange={(e) => dispatch(setNewMessage(e.target.value))}
                  onChange={handleInputTyping}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  borderRadius="full"
                  py={6}
                  bg={inputBg}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                />
              </InputGroup>

              <Tooltip label="Send message" placement="top">
                <IconButton
                  type="submit"
                  colorScheme="blue"
                  aria-label="Send message"
                  icon={<Send size={18} />}
                  isDisabled={!newMessage.trim() && !image}
                  borderRadius="full"
                  ml={2}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                />
              </Tooltip>
            </Flex>
          </>
        ) : (
          <Flex
            flex="1"
            direction="column"
            justify="center"
            align="center"
            bg={bgMain}
            p={8}
          >
            <Box
              bg={bgSidebar}
              p={10}
              borderRadius="xl"
              boxShadow="lg"
              textAlign="center"
              maxW="md"
            >
              <Heading size="lg" color={textPrimary} mb={4} fontWeight="bold">
                Welcome to Messages
              </Heading>
              <Text color={textSecondary} mb={6}>
                Select a conversation from the sidebar to start chatting or
                search for a specific contact.
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatPage;

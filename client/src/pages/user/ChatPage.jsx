import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  CameraIcon,
  Send,
  CheckCheck,
  Filter,
  Bell,
  Search,
  X,
  Badge,
  Phone,
  Video,
  MoreVertical,
  ImageIcon,
  BellOff,
  Paperclip,
  Smile,
  Mic,
  Clock,
} from "lucide-react";

import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  Divider,
  Avatar,
  IconButton,
  Spinner,
  useColorModeValue,
  Button,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Kbd,
} from "@chakra-ui/react";

import {
  handleGetMessages,
  handleSendMessage,
  handleMarkMessagesAsRead,
  handleGetContactsForSideBar,
  setImage,
  setImagePreview,
  setCurrentChat,
  setNewMessage,
} from "../../features/messages/messageSlice";

// Initialize socket connection
const socket = io("http://localhost:4001");

const ChatPage = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.messageSlice.contacts);
  const messages = useSelector((state) => state.messageSlice.messages);
  const currentChat = useSelector((state) => state.messageSlice.currentChat);
  const newMessage = useSelector((state) => state.messageSlice.newMessage);
  const image = useSelector((state) => state.messageSlice.image);
  const imagePreview = useSelector((state) => state.messageSlice.imagePreview);
  const isLoading = useSelector((state) => state.messageSlice.isLoading);

  const user = useSelector((state) => state?.auth?.user?.data);
  const userId = user?._id;

  const scrollRef = useRef();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

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

  // Fetch contacts for sidebar with pagination & search
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

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Handle Load More Contacts (Pagination)
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Socket.io setup
  useEffect(() => {
    if (!userId) return;

    socket.emit("addUser", userId);

    socket.on("newMessage", (message) => {
      if (
        currentChat?._id === message.receiverId ||
        currentChat?._id === message.senderId
      ) {
        dispatch(handleGetMessages(currentChat._id));
      }
    });

    socket.on("messages-read", ({ senderId, receiverId }) => {
      if (userId === senderId) {
        dispatch(handleMarkMessagesAsRead({ senderId, receiverId }));
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("messages-read");
    };
  }, [currentChat, dispatch, userId]);

  // Fetch messages when changing chat
  useEffect(() => {
    if (!currentChat) return;
    dispatch(handleGetMessages(currentChat._id));
  }, [currentChat, dispatch]);

  // Handle sending messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !image) || !currentChat) return;

    try {
      await dispatch(
        handleSendMessage({
          receiverId: currentChat._id,
          text: newMessage,
          image: image,
        })
      ).unwrap();
    } catch (err) {
      console.error("Error sending message:", err);
    }
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

  // Auto scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <Flex>
              <Tooltip label="Filter conversations" placement="top">
                <IconButton
                  icon={<Filter size={18} />}
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                  mr={2}
                />
              </Tooltip>
            </Flex>
          </Flex>

          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search conversations..."
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
                      <Avatar
                        name={contact.fullName}
                        color="white"
                        size="md"
                        boxShadow="sm"
                      ></Avatar>

                      <Box ml={3} flex="1">
                        <Flex justify="space-between" align="center">
                          <Text
                            fontWeight="semibold"
                            color={textPrimary}
                            fontSize="md"
                          >
                            {contact.fullName}
                          </Text>
                          <Text
                            fontSize="xs"
                            color={textSecondary}
                            display="flex"
                            alignItems="center"
                          >
                            <Clock size={12} className="mr-1" />
                            12:42 PM
                          </Text>
                        </Flex>

                        <Flex justify="space-between" align="center">
                          <Text
                            fontSize="sm"
                            color={textSecondary}
                            noOfLines={1}
                            maxW="180px"
                          >
                            {contact.role === "doctor" ? "Doctor" : "Patient"} •
                            Last message...
                          </Text>
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

        <Box p={4} borderTop="1px" borderColor={borderColor}>
          <Button
            w="full"
            onClick={handleLoadMore}
            colorScheme="blue"
            isDisabled={isLoading}
            size="md"
            borderRadius="lg"
            fontWeight="medium"
            leftIcon={<Paperclip size={16} />}
            _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
            transition="all 0.2s"
          >
            Load More Contacts
          </Button>
        </Box>
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
                >
                  <AvatarBadge
                    boxSize="1em"
                    bg="green.500"
                    borderColor="white"
                  />
                </Avatar>

                <Box ml={3}>
                  <Text fontWeight="semibold" color={textPrimary}>
                    {currentChat.fullName}
                  </Text>
                  <Flex align="center">
                    <Badge
                      colorScheme="green"
                      variant="subtle"
                      fontSize="xs"
                      mr={2}
                    >
                      Online
                    </Badge>
                    <Text fontSize="sm" color={textSecondary}>
                      {currentChat.role === "doctor" ? "Doctor" : "Patient"}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Flex>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVertical size={18} />}
                    variant="ghost"
                    colorScheme="blue"
                    borderRadius="full"
                    _hover={{ bg: "blue.50" }}
                  />
                  <MenuList>
                    <MenuItem icon={<Bell size={16} />}>
                      Mute notifications
                    </MenuItem>
                    <MenuItem icon={<ImageIcon size={16} />}>
                      View media
                    </MenuItem>
                  </MenuList>
                </Menu>
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
                        key={message._id}
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
                  onChange={(e) => dispatch(setNewMessage(e.target.value))}
                  borderRadius="full"
                  py={6}
                  bg={inputBg}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                />
                <InputRightElement width="4.5rem" h="100%">
                  <Flex>
                    <Tooltip label="Add emoji" placement="top">
                      <IconButton
                        icon={<Smile size={20} />}
                        variant="ghost"
                        colorScheme="blue"
                        borderRadius="full"
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Voice message" placement="top">
                      <IconButton
                        icon={<Mic size={20} />}
                        variant="ghost"
                        colorScheme="blue"
                        borderRadius="full"
                        size="sm"
                        mr={1}
                      />
                    </Tooltip>
                  </Flex>
                </InputRightElement>
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
              <Flex justify="center" mb={6}>
                <Kbd mr={2}>Ctrl</Kbd> + <Kbd mx={2}>K</Kbd>
                <Text ml={2}>to search</Text>
              </Flex>
              <Button
                colorScheme="blue"
                leftIcon={<Paperclip size={16} />}
                size="md"
              >
                Start a new conversation
              </Button>
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatPage;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { CameraIcon, Send, CheckCheck } from "lucide-react";

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

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const selectedBgColor = useColorModeValue("blue.50", "blue.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

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
    bg="gray.50" 
    className="shadow-sm border-gray-100 border-2"
  >
    {/* Contacts sidebar */}
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
          Conversations
        </Heading>
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={handleSearchChange}
          className="rounded-full px-4 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </Box>

      {isLoading ? (
        <Flex justify="center" p={4}>
          <Spinner color="blue.500" />
        </Flex>
      ) : (
        <Box className="max-h-[calc(100vh-250px)] overflow-y-auto">
          {contacts?.map((contact) => (
            <Box 
              key={contact._id}
              className={`
                transition duration-200 ease-in-out 
                ${currentChat?._id === contact._id 
                  ? 'bg-blue-50 hover:bg-blue-100' 
                  : 'hover:bg-gray-100'}
              `}
            >
              <Flex
                p={4}
                cursor="pointer"
                alignItems="center"
                onClick={() => dispatch(setCurrentChat(contact))}
              >
                <Avatar
                  name={contact.fullName}
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
                    {contact.fullName}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    color="gray.500"
                    className="text-gray-500"
                  >
                    {contact.role === "doctor" ? "Doctor" : "Patient"}
                  </Text>
                </Box>
              </Flex>
              <Divider borderColor="gray.200" />
            </Box>
          ))}
        </Box>
      )}

      <Button
        w="full"
        onClick={handleLoadMore}
        colorScheme="blue"
        mt={2}
        isDisabled={isLoading}
        className="rounded-b-lg hover:bg-blue-600 transition duration-300"
      >
        Load More Contacts
      </Button>
    </Box>

    {/* Chat area */}
    <Flex 
      flex="1" 
      direction="column" 
      className="bg-gray-50 rounded-r-lg"
    >
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
            <Avatar
              name={currentChat.fullName}
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
                {currentChat.fullName}
              </Text>
              <Text 
                fontSize="sm" 
                color="gray.500"
                className="text-gray-500"
              >
                {currentChat.role === "doctor" ? "Doctor" : "Patient"}
              </Text>
            </Box>
          </Flex>

          {/* Messages area */}
          <Box 
            flex="1" 
            p={4} 
            overflow="auto" 
            className="bg-gray-50 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
          >
            {isLoading ? (
              <Flex justify="center" align="center" h="full">
                <Spinner color="blue.500" />
                <Text ml={2} color="gray.600">Loading messages...</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap={4}>
                {messages.map((message) => {
                  const isMine =
                    (message.senderId?._id === userId ||
                      message.senderId === userId) &&
                    !(
                      message.receiverId?._id === userId ||
                      message.receiverId === userId
                    );

                  return (
                    <Flex
                      key={message._id}
                      justify={isMine ? "flex-end" : "flex-start"}
                      ref={scrollRef}
                    >
                      <Box
                        maxW="xs"
                        borderRadius="xl"
                        px={4}
                        py={2}
                        className={`
                          ${isMine 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-800'}
                          shadow-md
                        `}
                      >
                        {message?.text && (
                          <Text mb={1} className="text-sm">{message?.text}</Text>
                        )}
                        {message.image && (
                          <Box 
                            mt={2} 
                            borderRadius="md" 
                            overflow="hidden"
                            className="hover:scale-105 transition duration-300"
                          >
                            <img
                              src={message.image}
                              alt="Message attachment"
                              className="max-h-60 w-auto rounded-lg"
                            />
                          </Box>
                        )}
                        <Flex
                          justify="flex-end"
                          fontSize="xs"
                          mt={1}
                          className={`
                            ${isMine 
                              ? 'text-blue-100' 
                              : 'text-gray-500'}
                          `}
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
                                size={16}
                                opacity={message.read ? 1 : 0.5}
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
              onChange={(e) => dispatch(setNewMessage(e.target.value))}
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
            Welcome to Messages
          </Heading>
          <Text 
            mt={2} 
            color="gray.500"
            className="text-gray-600"
          >
            Select a contact to start chatting
          </Text>
        </Flex>
      )}
    </Flex>
  </Flex>
  );
};

export default ChatPage;

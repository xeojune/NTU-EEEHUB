import { useState } from "react";
import Active from "../../components/Chat/Active";
import OpenChatActive from "../../components/Chat/openChatActive";
import Individual from "../../components/Chat/Individual";
import Open from "../../components/Chat/Open";
import { ChatPageContainer, LeftPanel, RightPanel } from "../../styles/Chat/chatStyle";
import Layout from "../Layout";
import { Room } from "../../components/Chat/openChatActive";

interface SelectedUser {
  socketId: string;
  _id: string;
  name: string;
  profileImg: string;
}

const ChatPage: React.FC = () => {
  const [selectedUserSocketId, setSelectedUserSocketId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleUserSelect = (user: SelectedUser) => {
    setSelectedUserSocketId(user.socketId);
    setSelectedUser(user);
    setSelectedRoom(null); // Clear selected room when user is selected
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setSelectedUser(null); // Clear selected user when room is selected
    setSelectedUserSocketId(null);
  };

  return (
    <Layout>
      <ChatPageContainer>
        <LeftPanel>
          {/* Individual Chat List */}
          <Individual 
            onUserSelect={handleUserSelect}
            selectedUserSocketId={selectedUserSocketId}
          />
          {/* Open Chat List */}
          <Open
            onRoomSelect={handleRoomSelect}
            selectedRoomId={selectedRoom?._id || null}
          />
        </LeftPanel>

        <RightPanel>
          {/* Show either individual chat or open chat based on selection */}
          {selectedUser ? (
            <Active
              selectedUserSocketId={selectedUserSocketId}
              selectedUser={selectedUser}
            />
          ) : (
            <OpenChatActive
              selectedRoom={selectedRoom || undefined}
            />
          )}
        </RightPanel>
      </ChatPageContainer>
    </Layout>
  );
};

export default ChatPage;
import { useState } from "react";
import Active from "../../components/Chat/Active";
import Group from "../../components/Chat/Group";
import Individual from "../../components/Chat/Individual";
import { ChatPageContainer, LeftPanel, RightPanel } from "../../styles/Chat/chatStyle";
import Layout from "../Layout";

interface SelectedUser {
  socketId: string;
  _id: string;
  name: string;
  profileImg: string;
}

const ChatPage: React.FC = () => {
  const [selectedUserSocketId, setSelectedUserSocketId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const handleUserSelect = (user: SelectedUser) => {
    setSelectedUserSocketId(user.socketId);
    setSelectedUser(user);
  };

  return (
    <Layout>
      {/* Chat Page Container */}
      <ChatPageContainer>
        <LeftPanel>
          {/* Individual Chat List */}
          <Individual 
            onUserSelect={handleUserSelect}
            selectedUserSocketId={selectedUserSocketId}
          />
          {/* Group Chat List*/}
          <Group/>
        </LeftPanel>

        <RightPanel>
          {/* Active Chat */}
          <Active
            selectedUserSocketId={selectedUserSocketId}
            selectedUser={selectedUser || undefined}
          />
        </RightPanel>
      </ChatPageContainer>
    </Layout>
  )
}

export default ChatPage;
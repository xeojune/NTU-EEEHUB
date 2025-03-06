import Active from "../../components/Chat/Active";
import Group from "../../components/Chat/Group";
import Individual from "../../components/Chat/Individual";
import { ChatPageContainer, LeftPanel, RightPanel } from "../../styles/Chat/chatStyle";
import Layout from "../Layout";

const ChatPage: React.FC = () => {
  return (
    
    <Layout>
      {/* Chat Page Container */}
      <ChatPageContainer>
        <LeftPanel>
          {/* Individual Chat List */}
          <Individual/>
          {/* Group Chat List*/}
          <Group/>
        </LeftPanel>

        <RightPanel>
          {/* Active Chat */}
          <Active/>
        </RightPanel>

      </ChatPageContainer>
    </Layout>
  )
}

export default ChatPage;
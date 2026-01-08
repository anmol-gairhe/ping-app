import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import "./ChatPage.css";

const ChatPage = () => {
    const { user } = ChatState();

    return (
        <div className="chat-page">
            {user && <SideDrawer />}
            <div className="chat-container">
                {user && <MyChats />}
                {user && <ChatBox />}
            </div>
        </div>
    );
};

export default ChatPage;

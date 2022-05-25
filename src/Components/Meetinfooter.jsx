import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import AppsIcon from "@mui/icons-material/Apps";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updatePreference } from "../Server/peerConnection";

export const MeetingFooter = (props) => {
  const [streamState, setStreamState] = useState({
    mic: true,
    video: true,
    screen: false,
  });

  const micClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        mic: !currentState.mic,
      };
    });
  };
  const onVideoClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        video: !currentState.video,
      };
    });
  };
  //dispatcher for screen share
  const onScreenClick = () => {
    props.onScreenClick(setScreenState);
  };
  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        screen: isEnabled,
      };
    });
  };
  useEffect(() => {
    props.onMicClick(streamState.mic);
  }, [streamState.mic]);
  useEffect(() => {
    props.onVideoClick(streamState.video);
  }, [streamState.video]);

  return (
    <div className="footer">
      <div>
        <button onClick={micClick}>
          {streamState.mic ? <MicIcon /> : <MicOffIcon />}
        </button>
        <span>{streamState.mic ? "Mute" : "Unmute"}</span>
      </div>
      <div>
        <button onClick={onVideoClick}>
          {streamState.video ? <VideocamIcon /> : <VideocamOffIcon />}
        </button>
        <span>{streamState.video ? "Stop Video" : "Start Video"}</span>
      </div>
      <div>
        <button>
          <SecurityIcon />
        </button>
        <span>Security</span>
      </div>
      <div>
        <button>
          <GroupIcon />
        </button>
        <span>Participants</span>
      </div>
      <div>
        <button>
          <ChatBubbleIcon />
        </button>
        <span>Chat</span>
      </div>
      <div>
        <button onClick={onScreenClick}>
          {streamState.screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        </button>
        <span>{streamState.screen ? "Stop Screen" : "Share Screen"}</span>
      </div>
      <div>
        <button>
          <RadioButtonCheckedIcon />
        </button>
        <span>Record</span>
      </div>
      <div>
        <button>
          <AddReactionIcon />
        </button>
        <span>Reactions</span>
      </div>
      <div>
        <button>
          <AppsIcon />
        </button>
        <span>Apps</span>
      </div>
      <div>
        <button>
          <MoreHorizIcon />
        </button>
        <span>More</span>
      </div>
    </div>
  );
};

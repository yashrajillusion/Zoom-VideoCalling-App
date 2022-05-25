import React from "react";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Card from "./Card";

export const Participant = (props) => {
  const {
    curentIndex,
    currentParticipant,
    hideVideo,
    videoRef,
    showAvatar,
    currentUser,
  } = props;
  if (currentParticipant == null) return <></>;
  return (
    <div className={`participant ${hideVideo ? "hide" : ""}`}>
      <Card>
        <video
          ref={videoRef}
          className="video"
          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>
        {!currentParticipant.audio && (
          <MicIcon className="muted" title="Muted" />
        )}
        {showAvatar && (
          <div
            style={{ background: currentParticipant.avatarColor }}
            className="avatar"
          >
            {currentParticipant.userName[0]}
          </div>
        )}
        <div className="name">
          {currentParticipant.userName}
          {currentUser ? "(You)" : ""}
        </div>
      </Card>
    </div>
  );
};

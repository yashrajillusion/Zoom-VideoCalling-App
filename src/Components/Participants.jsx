import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Participant } from "./Participant";

const Participants = (props) => {
  let currentParticipant = null;
  const videoRef = useRef(null);
  const { participants, currentUser, mainStream } = useSelector(
    (store) => store.user
  );
  let participantKey = Object.keys(participants);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mainStream;
      videoRef.current.muted = true;
    }
  }, [currentUser, mainStream]);
  const currentUserVal = currentUser ? Object.values(currentUser)[0] : null;

  let gridCol =
    participantKey.length === 1 ? 1 : participantKey.length <= 4 ? 2 : 4;
  const gridColSize = participantKey.length <= 4 ? 1 : 2;
  let gridRowSize =
    participantKey.length <= 4
      ? participantKey.length
      : Math.ceil(participantKey.length / 2);

  const screenPresenter = participantKey.find((element) => {
    currentParticipant = participants[element];
    return currentParticipant.screen;
  });

  if (screenPresenter) {
    gridCol = 1;
    gridRowSize = 2;
  }
  const participantsval = participantKey.map((element, index) => {
    currentParticipant = participants[element];
    const isCurrentUser = currentParticipant.currentUser;

    if (isCurrentUser) {
      return null;
    }
    const pc = currentParticipant.peerConnection;
    const remoteStream = new MediaStream();
    let curentIndex = index;
    if (pc) {
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        const videElement = document.getElementById(
          `participantVideo${curentIndex}`
        );
        if (videElement) videElement.srcObject = remoteStream;
      };
    }
    return (
      <Participant
        key={curentIndex}
        currentParticipant={currentParticipant}
        curentIndex={curentIndex}
        hideVideo={screenPresenter && screenPresenter !== element}
        showAvatar={false}
      />
    );
  });
  return (
    <div
      style={{
        "--grid-size": gridCol,
        "--grid-col-size": gridColSize,
        "--grid-row-size": gridRowSize,
      }}
      className={`participants`}
    >
      {participantsval}
      <Participant
        currentParticipant={currentUserVal}
        curentIndex={participantKey.length}
        hideVideo={screenPresenter && !currentUser.screen}
        videoRef={videoRef}
        showAvatar={
          currentUserVal && !currentUserVal.video && !currentUserVal.screen
        }
        currentUser={true}
      />
    </div>
  );
};

export default Participants;

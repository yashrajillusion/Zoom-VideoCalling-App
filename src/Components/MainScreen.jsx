import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMainStream, updateUser } from "../Redux/action";
import { updatePreference } from "../Server/peerConnection";
import { MeetingFooter } from "./Meetinfooter";
import Participants from "./Participants";

export const MainScreen = () => {
  const { participants, currentUser, mainStream } = useSelector(
    (store) => store.user
  );
  const userId = currentUser && Object.keys(currentUser)[0];
  const participantRef = useRef(participants);
  const dispatch = useDispatch();

  const onMicClick = (micEnabled) => {
    if (mainStream) {
      mainStream.getAudioTracks()[0].enabled = micEnabled;
      updatePreference(userId, { audio: micEnabled });
      // dispatch(updateUser({ audio: micEnabled }));
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (mainStream) {
      mainStream.getVideoTracks()[0].enabled = videoEnabled;
      updatePreference(userId, { video: videoEnabled });
    }
  };

  useEffect(() => {
    participantRef.current = participants;
  }, [participants]);

  const updateStream = (stream) => {
    for (let key in participantRef.current) {
      const sender = participantRef.current[key];
      if (sender.currentUser) continue;
      const peerConnection = sender.peerConnection
        .getSenders()
        .find((s) => (s.track ? s.track.kind === "video" : false));
      peerConnection.replaceTrack(stream.getVideoTracks()[0]);
    }
    dispatch(setMainStream(stream));
  };

  const onScreenShareEnd = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStream.getVideoTracks()[0].enabled =
      Object.values(currentUser)[0].video;
    updateStream(localStream);
    dispatch(updateUser({ screen: false }));
  };

  const onScreenClick = async () => {
    let mediaStream;
    if (navigator.getDisplayMedia) {
      mediaStream = await navigator.getDisplayMedia({ video: true });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
    } else {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { mediaSource: "screen" },
      });
    }

    mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;

    updateStream(mediaStream);

    dispatch(updateUser({ screen: true }));
  };
  return (
    <div className="main-cont">
      <div className="mainscreen">
        <Participants />
      </div>
      <MeetingFooter
        onScreenClick={onScreenClick}
        onMicClick={onMicClick}
        onVideoClick={onVideoClick}
      />
    </div>
  );
};

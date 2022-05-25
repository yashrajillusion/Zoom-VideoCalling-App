import "./App.css";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firepadRef, { userName, connectedRef, dbRef } from "./Server/firebase";
import {
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
  setMainStream,
} from "./Redux/action";
import { MainScreen } from "./Components/MainScreen";

function App() {
  let { currentUser, mainStream } = useSelector((store) => store.user);
  const participantRef = firepadRef.child("participants");
  const dispatch = useDispatch();

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return localStream;
  };

  useEffect(() => {
    async function initSetup() {
      const stream = await getUserStream();
      stream.getVideoTracks()[0].enabled = true;
      dispatch(setMainStream(stream));
      connectedRef.on("value", (snap) => {
        if (snap.val()) {
          const defaultPreferences = {
            audio: true,
            video: true,
            screen: false,
          };
          const userRef = participantRef.push({
            userName,
            preferences: defaultPreferences,
          });
          dispatch(
            setUser({
              [userRef.key]: {
                userName,
                ...defaultPreferences,
              },
            })
          );
          userRef.onDisconnect().remove();
        }
      });
    }
    initSetup();
  }, []);

  const isUserSet = !!currentUser;
  const isStreamSet = !!mainStream;

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      participantRef.on("child_added", (snap) => {
        const preferenceUpdateEvent = participantRef
          .child(snap.key)
          .child("preferences");
        preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
          dispatch(
            updateParticipant({
              [snap.key]: {
                [preferenceSnap.key]: preferenceSnap.val(),
              },
            })
          );
        });

        const { userName: name, preferene = {} } = snap.val();
        dispatch(
          addParticipant({
            [snap.key]: {
              userName: name,
              ...preferene,
            },
          })
        );
      });
      participantRef.on("child_removed", (snap) => {
        dispatch(removeParticipant(snap.key));
      });
    }
  }, [isStreamSet, isUserSet]);
  return (
    <div className="App">
      <MainScreen />
    </div>
  );
}

export default App;

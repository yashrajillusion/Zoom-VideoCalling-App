import {
  createOffer,
  initializeListensers,
  updatePreference,
} from "../Server/peerConnection";
import {
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  SET_MAIN_STREAM,
  SET_USER,
  UPDATE_PARTICIPANT,
  UPDATE_USER,
} from "./action";

let initState = {
  currentUser: null,
  participants: {},
  mainStream: null,
};

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

export const reducer = (store = initState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      const userId1 = Object.keys(payload)[0];
      payload[userId1].avatarColor = generateColor();
      initializeListensers(userId1);
      return { ...store, currentUser: payload };

    case ADD_PARTICIPANT:
      const currentUserId = Object.keys(store.currentUser)[0];
      const newUserId = Object.keys(payload)[0];
      if (store.mainStream && currentUserId !== newUserId) {
        payload = addConnection(payload, store.currentUser, store.mainStream);
        console.log(payload);
      }
      if (currentUserId === newUserId) payload[newUserId].currentUser = true;
      payload[newUserId].avatarColor = generateColor();
      return { ...store, participants: { ...store.participants, ...payload } };

    case REMOVE_PARTICIPANT:
      let filter = { ...store.participants };
      delete filter[payload];
      return { ...store, participants: filter };

    case UPDATE_PARTICIPANT:
      const newuserId = Object.keys(payload)[0];
      payload[newuserId] = {
        ...store.participants[newuserId],
        ...payload[newuserId],
      };
      let participants = { ...store.participants, ...payload };
      return { ...store, participants };
    case UPDATE_USER:
      const userId = Object.keys(store.currentUser)[0];
      // updatePreference(userId, payload);
      return {
        ...store,
        currentUser: { ...store.currentUser, ...payload },
      };
    case SET_MAIN_STREAM:
      return { ...store, mainStream: payload };
    default:
      return store;
  }
};

const addConnection = (newUser, currentUser, stream) => {
  const peerConnection = new RTCPeerConnection(servers);
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
  const newUserId = Object.keys(newUser)[0];
  const currentUserId = Object.keys(currentUser)[0];

  const offerIds = [newUserId, currentUserId].sort((a, b) =>
    a.localeCompare(b)
  );
  newUser[newUserId].peerConnection = peerConnection;
  if (offerIds[0] !== currentUserId)
    createOffer(peerConnection, offerIds[0], offerIds[1]);
  return newUser;
};

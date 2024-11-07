const WebSocket = require("ws");
require("dotenv").config();
const aisSocket = new WebSocket("wss://stream.aisstream.io/v0/stream");

// Create websocket to broadcast data
const wss = new WebSocket.Server({ port: 8080 });

function convertToGeoJSON(aisMessage) {
  const { PositionReport } = aisMessage.Message;
  const { latitude, longitude, MMSI, ShipName, time_utc } = aisMessage.MetaData;

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    properties: {
      MMSI: MMSI,
      ShipName: ShipName.trim(),
      Cog: PositionReport.Cog,
      Sog: PositionReport.Sog,
      NavigationalStatus: PositionReport.NavigationalStatus,
      Timestamp: PositionReport.Timestamp,
      TrueHeading: PositionReport.TrueHeading,
      UserID: PositionReport.UserID,
      time_utc: time_utc,
    },
  };
}

aisSocket.onopen = function () {
  const subscriptionMessage = {
    Apikey: process.env.AIS_API_KEY,
    BoundingBoxes: [
      [
        [-90, -180],
        [90, 180],
      ],
    ],
    FiltersShipMMSI: ["368207620", "367719770", "211476060"],
    FilterMessageTypes: ["PositionReport"],
  };
  aisSocket.send(JSON.stringify(subscriptionMessage));
};

aisSocket.onmessage = function (event) {
  const aisMessage = JSON.parse(event.data);
  const geoJSONMessage = convertToGeoJSON(aisMessage);

  // Broadcast GeoJSON
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(geoJSONMessage));
    }
  });

  console.log(
    "GeoJSON message sent to clients:",
    JSON.stringify(geoJSONMessage, null, 2)
  );
};

// Handle error Websocket
aisSocket.onerror = function (error) {
  console.error("WebSocket error:", error);
};

// Handle close Websocket
aisSocket.onclose = function () {
  console.log("WebSocket connection to AIS stream closed");
};

// Handle client connection to Websocket
wss.on("connection", (ws) => {
  console.log("New client connected to local WebSocket server");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("Local WebSocket server running on ws://localhost:8080");

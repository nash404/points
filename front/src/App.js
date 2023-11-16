import { useEffect, useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5050");

const ico = L.icon({ iconUrl: icon });
const position = [51.505, -0.03];

const App = () => {
  const [positions, setPositions] = useState([]);
  const [pointX, setPointX] = useState("");
  const [pointY, setPointY] = useState("");
  const setPoint = () => {
    if (pointX.length === 0 || pointY.length === 0) {
      alert("Input all coords");
      return;
    }
    if (
      Number.isInteger(Number(pointX)) &&
      !isNaN(Number(pointX)) &&
      Number.isInteger(Number(pointY)) &&
      !isNaN(Number(pointY))
    ) {
      socket.emit("path", { points: [pointX, pointY] });
      return;
    }

    alert("Input number");
  };
  useEffect(() => {
    socket.on("getPoint", (data) => {
      setPositions(data);
    });
  }, [positions]);
  return (
    <div>
      <div className="setPoints">
        <div>
          <input
            placeholder="Input X"
            onChange={(event) => {
              setPointX(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <input
            placeholder="Input Y"
            onChange={(event) => {
              setPointY(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <button onClick={setPoint}>Set Point</button>
        </div>
      </div>
      <MapContainer center={position} zoom={3}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.map((item, index) => {
          return (
            <Marker position={[item.x, item.y]} icon={ico} key={index}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default App;

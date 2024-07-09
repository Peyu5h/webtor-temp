import React, { useEffect } from "react";

const Player = ({ magnetUrl, data }) => {
  useEffect(() => {
    if (!magnetUrl) {
      console.warn("No magnet URL available. Skipping Webtor player setup.");
      return;
    }

    // console.log(data?.name);

    window.webtor = window.webtor || [];
    window.webtor.push({
      id: "player",
      magnet: magnetUrl,
      on: function (e) {
        if (e.name === window.webtor.TORRENT_FETCHED) {
          console.log("Torrent fetched!", e.data);
        }
        if (e.name === window.webtor.TORRENT_ERROR) {
          console.log("Torrent error!");
        }
      },
      poster:
        data.screenshot[0] ||
        data.screenshot[2] ||
        "https://via.placeholder.com/150/0000FF/808080",
      lang: "en",
      i18n: {
        en: {
          common: {
            "prepare to play": "Preparing Video Stream... Please Wait...",
          },
          stat: {
            seeding: "Seeding",
            waiting: "Client initialization",
            "waiting for peers": "Waiting for peers",
            from: "from",
          },
        },
      },
      features: {
        title: false,
        settings: false,
        embed: false,
        subtitles: false,
        download: false,
      },
    });
  }, [magnetUrl]);
  return (
    <div>
      <div
        id="player"
        className="webtor mb-4 min-h-[26rem] w-auto bg-gray-900 text-white flex items-center justify-center"
      ></div>
    </div>
  );
};

export default Player;

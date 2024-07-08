import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { movieData } from "../atom";

const WebtorPlayer = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [magnetUrl, setMagnetUrl] = useState(null);
  const [movie, setMovie] = useAtom(movieData);
  console.log(movie);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Fetching data for id:", id);
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URI
        }/api/v1/search?site=1337x&query=${id}&limit=1`
      );
      const result = await response.json();
      const fetchedData = result?.data[0];

      if (fetchedData && fetchedData.magnet) {
        setData(fetchedData);
        setMagnetUrl(fetchedData.magnet);
      } else {
        console.error("No magnet URL found in fetched data:", fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!magnetUrl) {
      console.warn("No magnet URL available. Skipping Webtor player setup.");
      return;
    }

    console.log(data?.name);

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

  console.log(movie);

  return (
    <>
      <h1>{data.name}</h1>
      <h2>{data.category}</h2>
      <p>{data.size}</p>
      <p>{data.seeders}</p>
      <p>{data.leechers}</p>

      <div id="player" className="webtor" />
      {movie &&
        movie.length > 1 &&
        movie.map((item) => (
          <div key={item.hash}>
            <h2>{item.name}</h2>
            <p>{item.size}</p>
            <p>{item.seeders}</p>
            <p>{item.leechers}</p>
          </div>
        ))}
    </>
  );
};

export default WebtorPlayer;

import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { movieData } from "../atom";
import Player from "./Player";

const WebtorPlayer = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [magnetUrl, setMagnetUrl] = useState(null);
  const [movie, setMovie] = useAtom(movieData);
  const [groupedData, setGroupedData] = useState(null);
  const [counter, setCounter] = useState(0);

  console.log(id);

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
    if (!movie || !Array.isArray(movie)) {
      console.log("Movie data not yet loaded or is not an array.");
      return;
    }

    const processDataByQuality = (movieData) => {
      const groupedByQuality = movieData.reduce((acc, item) => {
        const quality = extractQuality(item.name);
        if (!acc[quality]) {
          acc[quality] = [];
        }
        acc[quality].push(item);
        return acc;
      }, {});

      return groupedByQuality;
    };

    const extractQuality = (name) => {
      const qualityMatch = name.match(/(360p|480p|720p|1080p|1440p|4K)/i);
      return qualityMatch ? qualityMatch[0].toUpperCase() : "Unknown";
    };
    const processedData = processDataByQuality(movie);
    setGroupedData(processedData);
    console.log(processedData);
  }, [movie]);

  if (!movie || !Array.isArray(movie)) {
    return (
      <>
        <h1>{data.name}</h1>
        <Player magnetUrl={magnetUrl} data={data} />
      </>
    );
  }

  if (!groupedData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>{data.name}</h1>
      <Player magnetUrl={magnetUrl} data={data} />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Movies by Quality</h1>
        {["360P", "480P", "720P", "1080P", "1440P", "4K", "Unknown"].map(
          (quality) =>
            groupedData[quality] && groupedData[quality].length > 0 ? (
              <div key={quality} className="my-4">
                <div className="p-4 border rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-2">{quality}</h2>
                  {groupedData[quality].map((item, index) => (
                    <div
                      key={index}
                      className="cursor-pointer w-48 py-2 px-4 mb-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                      onClick={() => setMagnetUrl(item.magnet)}
                    >
                      Server {index + 1} [{item.size}]
                    </div>
                  ))}
                </div>
              </div>
            ) : null
        )}
      </div>
    </>
  );
};

export default WebtorPlayer;

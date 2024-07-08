import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { useAtom } from "jotai";
import { movieData } from "../atom";

const fetchData = async () => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URI
      }/api/v1/trending?site=1337x&limit=25&page=1`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data.data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const fetchSearch = async ({ movie }) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_URI
      }/api/v1/search?site=1337x&query=${movie}&limit=25&page=1`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data.data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const extractYear = (name) => {
  const yearMatch = name.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : "Unknown";
};

const cleanName = (name) => {
  return name
    .replace(/[\.\-]/g, " ")
    .replace(/[:()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getBaseName = (name) => {
  const clean = cleanName(name);
  const year = extractYear(name);
  const seasonEpisodePattern = /(S\d{2})/i;

  let baseName = clean;
  if (seasonEpisodePattern.test(clean)) {
    const match = clean.match(seasonEpisodePattern);
    baseName = clean.split(match[0])[0].trim();
  } else if (year !== "Unknown") {
    baseName = clean.split(year)[0].trim();
  } else {
    const yearInBrackets = name.match(/\((19|20)\d{2}\)/);
    if (yearInBrackets) {
      baseName = clean.split(yearInBrackets[0])[0].trim();
    }
  }

  return baseName.replace(/:$/, "");
};

const processData = (data) => {
  const filteredData = data.filter(
    (item) =>
      item.category &&
      ["anime", "movies", "tv"].includes(item.category.toLowerCase())
  );

  const groupedByName = filteredData.reduce((acc, item) => {
    const baseName = getBaseName(item.name);
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(item);
    return acc;
  }, {});

  Object.keys(groupedByName).forEach((baseName) => {
    const items = groupedByName[baseName];
    const groupedByYear = items.reduce((acc, item) => {
      const year = extractYear(item.name);
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});

    groupedByName[baseName] = groupedByYear;
  });

  return groupedByName;
};

const MovieList = () => {
  const [groupedData, setGroupedData] = useState({});
  const [searchData, setSearchData] = useState({});
  const [movie, setMovie] = useAtom(movieData);
  console.log(movie);
  const getData = async () => {
    try {
      console.log("Fetching data...");
      const fetchedData = await fetchSearch({ movie: searchData });
      if (fetchedData.length) {
        const processedData = processData(fetchedData);
        setGroupedData(processedData);
      } else {
        setGroupedData({});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGroupedData({});
    }
  };

  const getTrending = async () => {
    try {
      console.log("Fetching data...");
      const fetchedData = await fetchData();
      if (fetchedData.length) {
        const processedData = processData(fetchedData);
        setGroupedData(processedData);
      } else {
        setGroupedData({});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGroupedData({});
    }
  };

  console.log(groupedData);

  return (
    <div>
      <input onChange={(e) => setSearchData(e.target.value)} type="text" />
      <button
        className="py-2 px-3 bg-teal-500 text-white"
        onClick={() => getData()}
      >
        GET DATA
      </button>
      <button
        className="py-2 px-3 bg-cyan-500 ml-8 text-white"
        onClick={() => getTrending()}
      >
        GET Trending
      </button>
      {Object.keys(groupedData).map((baseName) => (
        <Card key={baseName} baseName={baseName} groupedData={groupedData} />
      ))}
    </div>
  );
};

export default MovieList;

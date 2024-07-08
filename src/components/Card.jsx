import { useAtom } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { movieData } from "../atom";

const Card = ({ baseName, groupedData }) => {
  const [movieDatta, setMovieData] = useAtom(movieData);
  const route = useNavigate();

  const setMovie = () => {
    const allMovies = Object.values(groupedData[baseName]).flat();
    setMovieData(allMovies);
    route(`/player/${allMovies[0].hash}`);
  };

  return (
    <div onClick={setMovie} className="w-44">
      <div className="mt-4">
        {Object.keys(groupedData[baseName]).map((year) => (
          <div key={year} className="ml-5 mt-2 w-44 border-2 border-black">
            {groupedData[baseName][year].length > 0 && (
              <div className="cursor-pointer">
                {groupedData[baseName][year][0].poster ? (
                  <img
                    className="w-44 object-cover"
                    src={groupedData[baseName][year][0].poster}
                    alt="poster"
                  />
                ) : groupedData[baseName][year][0].screenshot &&
                  groupedData[baseName][year][0].screenshot.length > 0 ? (
                  <img
                    className="w-44  object-cover"
                    src={groupedData[baseName][year][0].screenshot[0]}
                    alt="screenshot"
                  />
                ) : (
                  <span>No image available</span>
                )}
              </div>
            )}
            <h2>{baseName}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;

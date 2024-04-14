import {
  addComment,
  usePagedWeatherData,
  useWeatherData,
} from "./hook";
import { stylesProps, useStyle } from "./style/style";

export function WeatherDisplay() {
  const { weatherData, onchange, setLatitude, setLongitude } = useWeatherData();
  const {
    styleBtn,
    styleFlex,
    styleGap,
    styleFontZise,
    styleDiv,
    styleDivMap,
    styleIsCommet,
  } = useStyle();
  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "70%" }}>
      <div>
        <h1>Weather Data</h1>
        <hr />
        <div style={styleFlex}>
          <input
            type="text"
            placeholder="latitude"
            onChange={(e) => {
              setLatitude(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="longitude"
            onChange={(e) => {
              setLongitude(e.target.value);
            }}
          />
          <button style={styleBtn} onClick={() => onchange({ search: true })}>
            Search
          </button>
        </div>
        <hr />
        <div style={styleFlex}>
          <p>Time zone: {weatherData.timezone}</p>
          <p>Time: {weatherData.hourly.data[1].date}</p>
          <p>summary: {weatherData.current.summary}</p>
        </div>
      </div>
      <hr />
      <WeatherDataDisplay
        styleBtn={styleBtn}
        styleGap={styleGap}
        styleFontZise={styleFontZise}
        styleDiv={styleDiv}
        styleDivMap={styleDivMap}
        styleIsCommet={styleIsCommet}
      />
    </div>
  );
}

const WeatherDataDisplay = ({
  styleBtn,
  styleGap,
  styleFontZise,
  styleDiv,
  styleDivMap,
  styleIsCommet,
}: stylesProps) => {
  const {
    data,
    nextPage,
    prevPage,
    setMagType,
    coment,
    setCommet,
    isComent,
    setIsCommet,
    id,
    setId,
  } = usePagedWeatherData();

  return (
    <div>
      <div>
        <div style={styleGap}>
          <div style={styleGap}>
            <button style={styleBtn} onClick={prevPage}>
              Prev
            </button>
            <button
              style={{ ...styleBtn, ...styleFontZise }}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
          <div style={styleGap}>
            <button
              style={{ ...styleBtn, ...styleFontZise }}
              onClick={() => setMagType("high")}
            >
              High
            </button>
            <button
              style={{ ...styleBtn, ...styleFontZise }}
              onClick={() => setMagType("low")}
            >
              Low
            </button>
          </div>
        </div>
        <div style={styleDiv}>
          {data.map((d, idx) => {
            return (
              <div key={idx} style={styleDivMap}>
                <p style={styleFontZise}>Title: {d.title}</p>
                <p style={styleFontZise}>MagType: {d.mag_type}</p>
                <p style={styleFontZise}>Magnitude: {d.magnitude}</p>
                <p style={styleFontZise}>Place: {d.place}</p>
                <p style={styleFontZise}>Tsunami: {d.tsunami}</p>
                <p style={styleFontZise}>Type: {d.type}</p>
                <p style={styleFontZise}>
                  Longitude: {d.coordinates.longitude}
                </p>
                <p style={styleFontZise}>Latitude: {d.coordinates.latitude}</p>
                {d.comments &&
                  d.comments.map((comment, index) => (
                    <p key={index} style={styleFontZise}>
                      Comment: {comment.body}
                    </p>
                  ))}
                <button
                  style={{ ...styleBtn, ...styleFontZise }}
                  onClick={() => {
                    setIsCommet(true), setId(d.external_id);
                  }}
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {isComent && (
        <div style={styleIsCommet}>
          <textarea
            placeholder="Comment"
            onChange={(e) => {
              setCommet(e.target.value);
            }}
          />
          <button
            style={{ ...styleBtn, ...styleFontZise }}
            onClick={() => {
              addComment(id, coment), setCommet(""), setIsCommet(false);
            }}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

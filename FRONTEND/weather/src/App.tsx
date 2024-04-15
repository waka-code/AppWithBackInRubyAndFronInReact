import { WeatherDataDisplay } from "./components/WeatherDataDisplay";
import { useWeatherData } from "./hook/hook";
import { useStyle } from "./style/style";

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
    <div style={{ width: "100%" }}>
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
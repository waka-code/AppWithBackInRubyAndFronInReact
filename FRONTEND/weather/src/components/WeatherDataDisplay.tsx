import { useMemo } from "react";
import { usePagedWeatherData } from "../hook/hook";
import { stylesProps } from "../style/style";

export const WeatherDataDisplay = (props: stylesProps) => {
  const {
    data,
    nextPage,
    prevPage,
    isComent,
    handleEdit,
    handleAddComment,
    handleSetCommet,
    handleSetMagType,
  } = usePagedWeatherData();

  const {
    styleBtn,
    styleGap,
    styleFontZise,
    styleDiv,
    styleDivMap,
    styleIsCommet,
  } = props;

  const styleBtnMemo = useMemo(() => ({ ...styleBtn }), [styleBtn]);

  return (
    <div>
      <div>
        <div style={styleGap}>
          <div style={styleGap}>
            <button style={styleBtnMemo} onClick={prevPage}>
              Prev
            </button>
            <button style={styleBtnMemo} onClick={nextPage}>
              Next
            </button>
          </div>
          <div style={styleGap}>
            <button
              style={styleBtnMemo}
              onClick={() => handleSetMagType("high")}
            >
              High
            </button>
            <button
              style={styleBtnMemo}
              onClick={() => handleSetMagType("low")}
            >
              Low
            </button>
          </div>
        </div>
        <div style={styleDiv}>
          {data.map((d, idx) => {
            return (
              <div key={idx} style={styleDivMap}>
                <p style={styleFontZise} title={d.title}>
                  Title: {d.title}
                </p>
                <p style={styleFontZise} title={d.mag_type}>
                  MagType: {d.mag_type}
                </p>
                <p style={styleFontZise} title={d.magnitude.toString()}>
                  Magnitude: {d.magnitude}
                </p>
                <p style={styleFontZise} title={d.place}>
                  Place: {d.place}
                </p>
                <p style={styleFontZise}>Tsunami: {d.tsunami}</p>
                <p style={styleFontZise} title={d.type}>
                  Type: {d.type}
                </p>
                <p
                  style={styleFontZise}
                  title={d.coordinates.longitude.toString()}
                >
                  Longitude: {d.coordinates.longitude}
                </p>
                <p
                  style={styleFontZise}
                  title={d.coordinates.latitude.toString()}
                >
                  Latitude: {d.coordinates.latitude}
                </p>
                {d.comments &&
                  d.comments.map((comment, index) => (
                    <p key={index} style={styleFontZise} title={comment.body}>
                      Comment: {comment.body}
                    </p>
                  ))}
                <button
                  style={styleBtnMemo}
                  onClick={() => handleEdit(d.external_id)}
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
              handleSetCommet(e);
            }}
          />
          <button style={styleBtnMemo} onClick={handleAddComment}>
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

import { CSSProperties } from 'react';

export type stylesProps = {
  styleGap: CSSProperties;
  styleFontZise: CSSProperties;
  styleDiv: CSSProperties;
  styleDivMap: CSSProperties;
  styleIsCommet: CSSProperties;
  styleBtn: CSSProperties;
}
export function useStyle() {
    const styleBtn = {
        cursor: "pointer",
        border: "none",
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.20)",
        margin: "2px",
        borderRadius: "3px",
        padding: "5px",
      };

      const styleFlex = { display: "flex", gap: "12px" }

      const styleGap = { display: "flex", gap: "8px", padding: "2px" };

      const styleFontZise = { 
        fontSize: "12px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      };

      const styleDiv = {
        gap: "8px",
        marginTop: "10px",
        border: "1px solid black",
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.30)",
      }

      const styleDivMap = {
        alignItems: "center",
        justifyContent: "between",
        display: "flex",
        gap: "15px",
        borderBlockEnd: "1px solid black",
        padding: "2px",
      }

      const styleIsCommet = {
        padding: "10px",
        gap: "8px",
        width: "25%",
        border: "1px solid black",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.30)",
      }

  return {
   styleBtn,
    styleFlex,
    styleGap,
    styleFontZise,
    styleDiv,
    styleDivMap,
    styleIsCommet
  }
}

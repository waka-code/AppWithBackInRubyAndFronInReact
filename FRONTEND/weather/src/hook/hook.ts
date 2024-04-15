import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import {
  Add_Commet,
  get_Add_Data,
  get_All_Data,
  get_Data,
  get_Weather_Data,
  localhost,
} from "../apis/Apis";

type HourlyData = {
  date: string;
};

type WeatherData = {
  timezone: string;
  current: {
    summary: string;
  };
  hourly: {
    data: HourlyData[];
  };
};

type location = {
  latitude: string | undefined;
  longitude: string;
};

export function useWeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [location, setLocation] = useState<location>({
    latitude: "35.6895N",
    longitude: "0",
  });

  const search = useCallback(
    ({ search }: { search: boolean }) => {
      if (search) {
        setLocation((prevLocation) => ({
          ...prevLocation,
          latitude: latitude,
          longitude: longitude,
        }));
      }
    },
    [longitude, latitude]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${get_Weather_Data}/${location?.latitude}/longitud/${location?.longitude}`
        );

        const { data } = response;
        setWeatherData(data);

        const dataSaved = {
          type: "Weather",
          weather_attributes: {
            external_id: nanoid(),
            magnitude: data.elevation,
            place: data.timezone,
            tsunami: data.elevation === 0 ? true : false,
            mag_type: data.elevation > 10 ? "high" : "low",
            title: data.current.summary,
            coordinates: {
              longitude: data.lon,
              latitude: data.lat,
            },
            links: {
              external_url: `${get_Data}`,
            },
          },
        };

        await axios.post(get_Add_Data, dataSaved);
        socket.emit("newData");
      } catch (error) {
        console.log("Error fetching weather data: ", error);
      }
    };

    fetchData();
  }, [location]);
  return {
    weatherData,
    onchange: search,
    setLatitude,
    setLongitude,
  };
}

type commentsProps = {
  external_id: string;
  body: string;
};
type WeatherDataProps = {
  external_id: string;
  title: string;
  mag_type: string;
  magnitude: number;
  place: string;
  tsunami: boolean;
  type: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  comments: commentsProps[];
};

const socket = io(localhost);
export const usePagedWeatherData = () => {
  const [allData, setAllData] = useState<WeatherDataProps[]>([]);
  const [page, setPage] = useState(1);
  const [magType, setMagType] = useState<string | null>(null);
  const [isComent, setIsCommet] = useState(false);
  const [coment, setCommet] = useState("");
  const [id, setId] = useState("");
  const totalPages = allData.length / 10;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(get_All_Data, {
          params: {
            mag_type: magType,
            page: page,
          },
        });
        const { data: datos } = response;
        setAllData(datos);
      } catch (error) {
        console.log("Error fetching all data: ", error);
      }
    };

    fetchAllData();

    socket.on("newData", fetchAllData);

    return () => {
      socket.off("newData", fetchAllData);
    };
  }, [page, magType]);

  const nextPage = useCallback(() => {
    setPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  }, []);

  return {
    data: allData,
    nextPage,
    prevPage,
    setMagType,
    totalPages,
    coment,
    setCommet,
    isComent,
    setIsCommet,
    id,
    setId,
  };
};

export const addComment = async (externalId: string, commentBody: string) => {
  try {
    await axios.post(Add_Commet, {
      external_id: externalId,
      body: commentBody,
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

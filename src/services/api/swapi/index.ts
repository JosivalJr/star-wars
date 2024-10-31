import axios from "axios";
import {
  responseInterceptor,
  errorInterceptor,
} from "../axios-config/interceptors";

const api_url = import.meta.env.VITE_SWAPI_URL;

const Api = axios.create({
  baseURL: api_url,
  params: {},
});

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error)
);

export { Api };

import { Api } from "./swapi";

import { IPlanet, ISWAPIListResponse } from "../../types/swapi";

const list = async (
  page?: number
): Promise<ISWAPIListResponse<IPlanet> | Error> => {
  try {
    const { data } = await Api.get<ISWAPIListResponse<IPlanet>>("/planets", {
      params: { page: page },
    });

    if (data) return data;

    return new Error("Error to access SWAPI.");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Error to access SWAPI."
    );
  }
};

const find = async (
  id: number
): Promise<ISWAPIListResponse<IPlanet> | Error> => {
  try {
    const { data } = await Api.get<ISWAPIListResponse<IPlanet>>(
      `/planets/${id}`
    );

    if (data) return data;

    return new Error("Error to access SWAPI.");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Error to access SWAPI."
    );
  }
};

export default {
  list,
  find,
};

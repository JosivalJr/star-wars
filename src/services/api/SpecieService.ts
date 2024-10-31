import { Api } from "./swapi";

import { ISpecie, ISWAPIListResponse } from "../../types/swapi";

const list = async (
  page?: number
): Promise<ISWAPIListResponse<ISpecie> | Error> => {
  try {
    const { data } = await Api.get<ISWAPIListResponse<ISpecie>>("/species", {
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
): Promise<ISWAPIListResponse<ISpecie> | Error> => {
  try {
    const { data } = await Api.get<ISWAPIListResponse<ISpecie>>(
      `/species/${id}`
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

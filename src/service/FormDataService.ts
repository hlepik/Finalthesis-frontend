import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiBaseUrl } from "../configuration";
import { IFetchResponse } from "../types/IFetchResponse";
import { IMessages } from "../types/IMessages";

export abstract class FormDataService {
  protected static axios = Axios.create({
    baseURL: ApiBaseUrl,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  protected static getAxiosConfiguration(
    token?: string
  ): AxiosRequestConfig | undefined {
    if (!token) return undefined;
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return config;
  }

  static async getAll<TEntity>(
    apiEndpoint: string,
    token?: string
  ): Promise<IFetchResponse<TEntity[]>> {
    try {
      let response = await this.axios.get<TEntity[]>(
        apiEndpoint,
        FormDataService.getAxiosConfiguration(token)
      );
      return {
        ok: response.status <= 299,
        statusCode: response.status,
        data: response.data,
      };
    } catch (err) {
      let error = err as AxiosError;
      return {
        ok: false,
        statusCode: error.response?.status ?? 500,
        messages: (error.response?.data as IMessages).messages,
      };
    }
  }

  static async get<TEntity>(
    apiEndpoint: string,
    token?: string
  ): Promise<IFetchResponse<TEntity>> {
    try {
      let response = await this.axios.get<TEntity>(
        apiEndpoint,
        FormDataService.getAxiosConfiguration(token)
      );
      return {
        ok: response.status <= 299,
        statusCode: response.status,
        data: response.data,
      };
    } catch (err) {
      let error = err as AxiosError;
      return {
        ok: false,
        statusCode: error.response?.status ?? 500,
        messages: (error.response?.data as IMessages).messages,
      };
    }
  }
  static async edit<TEntity>(
    apiEndpoint: string,
    editData: TEntity,
    token?: string
  ): Promise<IFetchResponse<TEntity>> {
    try {
      let response = await this.axios.put<TEntity>(
        apiEndpoint,
        editData,
        FormDataService.getAxiosConfiguration(token)
      );
      return {
        ok: response.status <= 299,
        statusCode: response.status,
        data: response.data,
      };
    } catch (err) {
      let error = err as AxiosError;
      return {
        ok: false,
        statusCode: error.response?.status ?? 500,
        messages: (error.response?.data as IMessages).messages,
      };
    }
  }

  static async post<TEntity>(
    apiEndpoint: string,
    postData: TEntity,
    token?: string
  ): Promise<IFetchResponse<TEntity>> {
    try {
      let response = await this.axios.post<TEntity>(
        apiEndpoint,
        postData,
        FormDataService.getAxiosConfiguration(token)
      );
      return {
        ok: response.status <= 299,
        statusCode: response.status,
        data: response.data,
      };
    } catch (err) {
      let error = err as AxiosError;
      return {
        ok: false,
        statusCode: error.response?.status ?? 500,
        messages: (error.response?.data as IMessages).messages,
      };
    }
  }
  static async delete<TEntity>(
    apiEndpoint: string,
    token?: string
  ): Promise<IFetchResponse<TEntity>> {
    try {
      let response = await this.axios.delete<TEntity>(
        apiEndpoint,
        FormDataService.getAxiosConfiguration(token)
      );
      return {
        ok: response.status <= 299,
        statusCode: response.status,
        data: response.data,
      };
    } catch (err) {
      let error = err as AxiosError;
      return {
        ok: false,
        statusCode: error.response?.status ?? 500,
        messages: (error.response?.data as IMessages).messages,
      };
    }
  }
}

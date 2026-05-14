import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, DEV_API_URL, PROD_API_URL } from "@/helpers/api-config";

export const DEV_URL = DEV_API_URL;
export const PROD_URL = PROD_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, null, {
      withCredentials: true,
    });
    const token = res.data?.accessToken as string | undefined;
    if (token) {
      Cookies.set("access_token", token);
      return token;
    }
    Cookies.remove("access_token");
    return null;
  } catch {
    Cookies.remove("access_token");
    throw new Error("refresh-failed");
  }
};

const hasHeaderTrue = (hdrs: any, key: string) => {
  if (!hdrs) return false;
  const get = (k: string) => {
    if (hdrs instanceof AxiosHeaders) return hdrs.get(k);
    return hdrs[k] ?? hdrs[k.toLowerCase()];
  };
  const v = get(key) ?? get(key.toLowerCase());
  if (v === undefined) return false;
  if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
  if (typeof v === "number") return v === 1;
  if (typeof v === "boolean") return v;
  return Boolean(v);
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    const unauthOk = hasHeaderTrue(config.headers, "x-unauth-ok");

    if (!token || token === "undefined") {
      Cookies.remove("access_token");
      if (unauthOk) {
        if (config.headers instanceof AxiosHeaders)
          config.headers.delete("Authorization");
        else if (config.headers)
          delete (config.headers as any)["Authorization"];
        return config;
      }
      // Tidak ada redirect di sini — biarkan server balas 401, kita tangani di response interceptor
      return config;
    }

    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers as any),
        Authorization: `Bearer ${token}`,
      } as any;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;
    const unauthOk = hasHeaderTrue(originalRequest?.headers, "x-unauth-ok");

    if (status === 401 && unauthOk) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();
        if (newToken) {
          if (originalRequest.headers instanceof AxiosHeaders) {
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          } else {
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${newToken}`,
            };
          }
          return axiosInstance(originalRequest);
        }
        if (typeof window !== "undefined") {
          window.location.href = "/auth/sign-in";
        }
        return Promise.reject(error);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/sign-in";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

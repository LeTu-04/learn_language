import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const clientAPI = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});


// error = {
//   config: { ...request_config },
//   response: { ...server_response },
//   message: "...",
// }

// {
//   url: "/users",
//   method: "get",
//   baseURL: "http://localhost:3000",
//   headers: {
//     Authorization: "Bearer oldToken"
//   }
// }




// đính accessToken

clientAPI.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {

    const { store } = await import('../../redux/store')
    const token = store.getState().Auth.token;

    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


//REFRESH TOKEN QUEUE

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {

  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};



//RESPONSE INTERCEPTOR


clientAPI.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const { store } = await import("../../redux/store");
    const { refresh } = await import("../../services/auth_service");


    const originalRequest: any = error.config;

    //NOT 401 -> reject normally


    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }


    // Skip refresh endpoint


    if (originalRequest.url === "/auth/refresh") {
      return Promise.reject(error);
    }


    // User chưa login -> không refresh


    const token = store.getState().Auth.token;

    if (!token) {
      return Promise.reject(error);
    }


    // Avoid retry loop


    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;


    // Nếu đang refresh -> queue

    if (isRefreshing) { // đảm bảo 1 refreshToken được chạy 1 thời điểm

      return new Promise((resolve, reject) => {

        failedQueue.push({

          resolve: (newToken: string) => {

            if (originalRequest.headers) {
              originalRequest.headers.set(
                "Authorization",
                `Bearer ${newToken}`
              );
            }

            resolve(clientAPI(originalRequest));

          },

          reject: (err: any) => reject(err),

        });

      });

    }


    // START REFRESH

    isRefreshing = true;

    try {

      const newToken =
        await store.dispatch(refresh()).unwrap();

      processQueue(null, newToken);

      if (originalRequest.headers) {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newToken}`
        );
      }

      return clientAPI(originalRequest);

    } catch (err) {

      processQueue(err, null);

      /*
      Refresh fail -> logout
      */

      window.location.replace("/login");

      return Promise.reject(err);

    } finally {

      isRefreshing = false;

    }

  }
);
import axios from "axios";
import { AsyncStorage } from "react-native";

const api = axios.create({
  baseURL: "https://poty-api.herokuapp.com"
  //baseURL: '192.168.0.13:3333'
});

api.interceptors.request.use(
  async function(config) {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.apikey = "A?D(G-KaPdSgVkYp3s6v9y$B&E)H@MbQ";
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default api;

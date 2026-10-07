import axios from "axios";
import { createApi } from "../../../shared/http.js";
export default createApi(axios, import.meta.env?.VITE_API_URL, () => window.dispatchEvent(new Event("shopvault:unauthorized")));

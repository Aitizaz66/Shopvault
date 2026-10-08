import axios from "axios";
import { createApi, apiBaseUrl } from "../../../shared/http.js";
export default createApi(axios, apiBaseUrl(import.meta.env), () => window.dispatchEvent(new Event("shopvault-admin:unauthorized")));

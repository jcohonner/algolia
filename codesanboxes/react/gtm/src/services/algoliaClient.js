import { algoliasearch } from "algoliasearch";
import config from "../config";
export const algoliaClient = algoliasearch(config.APPID, config.API_KEY);

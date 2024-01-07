import config from "./config";

export const getUrl = (path) => {
    return config.backend + path;
};

const config = {
  app: {
    apiHost: process.env.REACT_APP_API_HOST,
    mapHost: process.env.REACT_APP_ATLAS_URL,
    currentMapHost: process.env.REACT_APP_CURRENT_ATLAS_URL,
    currentMapThumbnail: process.env.REACT_APP_CURRENT_ATLAS_THUMBNAIL,
  },
  paths: {
    register: {
      url: "/auth/register",
      method: "POST",
    },
    login: {
      url: "/auth/login",
      method: "POST",
    },
    getInfo: { url: "/auth/me", method: "GET" },
    getToken: { url: "/auth/get-token", method: "POST" },
    logout: { url: "/auth/logout", method: "POST" },
    getUsers: {
      url: "/users",
      method: "GET",
    },
    createUser: {
      url: "/users",
      method: "POST",
    },
    editUser: {
      url: "/users",
      method: "PATCH",
    },
    deleteUser: {
      url: "/users",
      method: "DELETE",
    },
    getAtlasItemTypes: {
      url: "/types",
      method: "GET",
    },
    createAtlasItemTypes: {
      url: "/types",
      method: "POST",
    },
    editAtlasItemType: {
      url: "/types",
      method: "PATCH",
    },
    deleteAtlasItemType: {
      url: "/types",
      method: "DELETE",
    },
    editAtlas: { url: "/atlas/map", method: "PATCH" },
    getAtlasHistories: { url: "/atlas/histories", method: "GET" },
    getAtlasMap: {
      url: " https://atlas-server-dev.demetaverse.me/v2/map.png",
      method: "GET",
    },
    revertAtlasMap: {
      url: "/atlas/revert-map",
      method: "PATCH",
    },
    revertAllAtlasMap: {
      url: "/atlas/revert-map-all",
      method: "PATCH",
    },
    createRequestEditMap: {
      url: "/requests",
      method: "POST",
    },
    getRequestEditMap: {
      url: "/requests",
      method: "GET",
    },
    editRequestEditMap: {
      url: "/requests",
      method: "PATCH",
    },
    considerRequestEditMap: {
      url: "/requests/consider",
      method: "PATCH",
    },
    deleteRequestEditMap: {
      url: "/requests",
      method: "DELETE",
    },
    considerManyRequestEditMap: {
      url: "/requests/consider-many",
      method: "PATCH",
    },
    getModels: {
      url: "/models",
      method: "GET",
    },
    createModel: {
      url: "/models",
      method: "POST",
    },
    deleteModel: {
      url: "/models",
      method: "DELETE",
    },
    updateZip: {
      url: "/types/zip",
      method: "PATCH",
    },
    checkCoords: {
      url: "/atlas/check-coords",
      method: "GET",
    },
    uploadTemp: {
      url: "/models/upload-temp",
      method: "POST",
    },
  },
};

export default config;

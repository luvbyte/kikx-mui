import { getUrl } from "./config";
import { request } from "./api";

import { parseArgsAndKwargs } from "./utils";

class Service {
  constructor(name, client) {
    this.serviceName = name;
    this.client = client;
    // Api url
    this.baseURL = getUrl(`/service/${this.serviceName}`);
  }
  request(
    endpoint,
    {
      method = "GET",
      body = undefined,
      params = {},
      headers = {},
      ...options
    } = {}
  ) {
    Object.assign(headers, {
      "kikx-client-id": this.client.clientID
    });
    return request(`${this.baseURL}/${endpoint}`, {
      method,
      body,
      params,
      headers,
      ...options
    });
  }

  async fetch(
    endpoint,
    {
      method = "GET",
      body = undefined,
      params = {},
      headers = {},
      ...options
    } = {}
  ) {
    const { data, error } = await this.request(endpoint, {
      method,
      body,
      params,
      headers,
      ...options
    });

    if (error) {
      throw new Error(error.detail || "Error fetching data");
    }

    return data;
  }
}

export class SystemService extends Service {
  constructor(client) {
    super("system", client);
  }

  // Get client info
  getClientInfo() {
    return this.fetch("info/client");
  }

  // Fetch apps info
  fetchAppsList(meta = false) {
    return this.fetch("info/apps-list", {
      params: { meta }
    });
  }

  // Run client funcx
  clientFunc = (name, config) =>
    this.request("funcx/run", {
      method: "POST",
      body: {
        name,
        config
      }
    });

  // Run funcx with args and options
  func(name, ...args) {
    const parsed = parseArgsAndKwargs(...args);

    return this.clientFunc(name, {
      args: parsed.args,
      options: parsed.options
    });
  }

  // Get Kikx Config
  getKikxConfig(reset) {
    return this.request("kikx-config", {
      params: { reset }
    });
  }

  // Update kikc config
  updatekikxConfig(config) {
    return this.request("kikx-config", {
      method: "POST",
      body: {
        config
      }
    });
  }
}

export class FileSystemService extends Service {
  constructor(client) {
    super("fs", client);
  }
  // List files
  listFiles(
    directory,
    {
      offset = 0,
      limit = -1,
      sort = "name",
      asc = true,
      thumbnails = false
    } = {}
  ) {
    return this.request("list", {
      params: {
        directory,
        offset,
        limit,
        sort,
        asc,
        thumbnails
      }
    });
  }

  // Get thumbnail
  thumbnail = filename =>
    this.request("thumbnail", {
      params: { filename }
    });

  // Read File
  readFile = filename =>
    this.request("read", {
      params: { filename }
    });

  // Write File
  writeFile = (filename, content, ensure = false) =>
    this.request("write", {
      method: "POST",
      body: { filename, content, ensure_dir: ensure }
    });

  // Delete File
  deleteFile = filename =>
    this.request("delete", {
      method: "DELETE",
      params: { filename }
    });

  // Upload file
  uploadFile = (file, dest) => {
    const formData = new FormData();
    formData.append("files", file);

    return this.request("upload", {
      method: "POST",
      body: formData,
      params: {
        dest
      }
    });
  };

  createDirectory = dirname =>
    this.request("create_directory", {
      method: "POST",
      body: { dirname }
    });

  // Delete directory
  deleteDirectory = dirname =>
    this.request("delete_directory", {
      method: "DELETE",
      params: { dirname }
    });

  // Get file info
  getFileInfo = path =>
    this.request("info", {
      params: { path }
    });

  expose = async (path, expires = null) =>
    this.request("expose", {
      method: "POST",
      body: { path, expires }
    });

  getServeUrl = (uid, path = "") => {
    return `${this.baseURL}/serve/${uid}/${encodeURIComponent(path)}`;
    // const url = `${this.baseURL}/serve/${uid}/${encodeURIComponent(path)}`;
    // if (absolute) {
    //   return getUrl(url);
    // }

    // return url;
  };

  // Get full file url
  getServeAbsUrl = (uid, path = "") => this.getServeUrl(uid, path);
}

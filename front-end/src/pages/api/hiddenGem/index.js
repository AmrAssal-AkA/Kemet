import { proxyBackendRequest } from "@/utils/backendProxy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  return proxyBackendRequest(req, res, "/api/hiddenGem");
}

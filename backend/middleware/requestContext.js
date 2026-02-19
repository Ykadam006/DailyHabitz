const crypto = require("crypto");

const REQUEST_ID_HEADER = "x-request-id";

/**
 * Attach requestId to each request. Use X-Request-Id from client if provided.
 */
function requestContext(req, res, next) {
  req.requestId = req.get(REQUEST_ID_HEADER) || crypto.randomBytes(8).toString("hex");
  res.setHeader(REQUEST_ID_HEADER, req.requestId);
  next();
}

module.exports = { requestContext, REQUEST_ID_HEADER };

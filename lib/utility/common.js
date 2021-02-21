const mongoose = require('mongoose');
const { logger } = require('./util_keys');
module.exports = {
  list_all_response: (
    res,
    status_code,
    status,
    message,
    totalDoc,
    totalPages,
    currentPage,
    result_message,
  ) => {
    const server_response = {
      status_code,
      status,
      message,
      totalDoc,
      totalPages,
      currentPage,
      data: result_message,
    };
    if (status) logger.info(message);
    else {
      const child = logger.child({ data: result_message });
      child.error(message);
    }
    return res.status(status_code).send(server_response);
  },

  com_response(res, status_code, status, message, result_message) {
    const server_response = {
      status_code,
      status,
      message,
      data: result_message,
    };
    if (status) logger.info(message);
    else {
      const child = logger.child({ data: result_message });
      child.error(message);
    }
    return res.status(status_code).send(server_response);
  },

  list_user_response: (res, status_code, response) => {
    return res.status(status_code).send(response);
  },

  response_dub_not(
    res,
    status_code,
    status,
    message,
    result_message,
    imported,
    not_found,
    duplicate,
  ) {
    const server_response = {
      status_code,
      status,
      message,
      data: result_message,
      imported,
      not_found,
      duplicate,
    };
    if (status) logger.info(message);
    else {
      const child = logger.child({ data: result_message });
      child.error(message);
    }
    return res.status(status_code).send(server_response);
  },

  response_function(res, status_code, status, message, result_message) {
    const server_response = {
      status_code,
      status,
      message,
      data: result_message,
    };
    if (status) logger.info(message);
    else {
      const child = logger.child({ data: result_message });
      child.error(message);
    }
    return server_response;
  },
  list_all_response_function: (
    res,
    status_code,
    status,
    message,
    totalDoc,
    totalPages,
    currentPage,
    result_message,
  ) => {
    const server_response = {
      status_code,
      status,
      message,
      totalDoc,
      totalPages,
      currentPage,
      data: result_message,
    };
    if (status) logger.info(message);
    else {
      const child = logger.child({ data: result_message });
      child.error(message);
    }
    return server_response;
  },

  // from DA
  sendResult(res, status_code, message, result_message) {
    const response = {
      status_code,
      message,
      data: result_message,
    };
    return res.status(status_code).send(response);
  },

  sendErrorResponse(res, status_code, message, e) {
    const response = {
      status_code,
      message,
      error: e ? e.message : '',
    };
    return res.status(status_code).send(response);
  },
  convertToMongoObjectId(id) {
    return mongoose.Types.ObjectId(id);
  },
};

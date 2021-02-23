const { logger } = require('./util_keys');
module.exports = {
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
};

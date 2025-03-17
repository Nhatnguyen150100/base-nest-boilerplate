const DEFINE_STATUS_RESPONSE = {
  SUCCESS: {
    statusCode: 200,
    message: 'Success',
  },
  BAD_REQUEST: {
    statusCode: 400,
    message: 'Bad Request',
  },
  NOT_FOUND: {
    statusCode: 404,
    message: 'Not Found',
  },
  ERROR_SERVER: {
    statusCode: 500,
    message: 'Internal Server Error',
  }
};

export { DEFINE_STATUS_RESPONSE };

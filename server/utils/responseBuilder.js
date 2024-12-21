const createResponse = ({
  isSuccess,
  statusCode,
  message,
  data = null,
  error = null,
}) => ({
  isSuccess,
  statusCode,
  message,
  data,
  error,
});

export default createResponse;

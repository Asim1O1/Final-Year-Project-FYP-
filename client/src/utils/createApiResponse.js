const createApiResponse = ({
    isSuccess,
    message,
    data = null,
    error = null,
  }) => ({
    isSuccess,
    message,
    data,
    error,
  });
  
  export default createApiResponse;
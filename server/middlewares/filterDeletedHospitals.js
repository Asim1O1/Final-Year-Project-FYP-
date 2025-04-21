import Hospital from "../models/hospital.model.js";
import createResponse from "../utils/responseBuilder.js";

const checkHospitalIsNotDeleted = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital || hospital.isDeleted) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found or has been deleted.",
          error: null,
          data: null,
        })
      );
    }

    req.hospital = hospital;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkHospitalIsNotDeleted;

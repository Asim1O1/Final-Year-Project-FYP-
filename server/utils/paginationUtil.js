export const paginate = async (model, query = {}, options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      populate = "",
    } = options;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      throw new Error("Page and limit must be positive integers.");
    }

    const skip = (pageNumber - 1) * limitNumber;

    const queryBuilder = model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    if (populate) {
      queryBuilder.populate(populate);
    }

    const [data, totalCount] = await Promise.all([
      queryBuilder.exec(),
      model.countDocuments(query),
    ]);

    return {
      data,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  } catch (error) {
    console.error("Error in paginate function:", error);
    throw error;
  }
};

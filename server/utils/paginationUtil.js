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

    console.log(
      "📄 Paginate Inputs — page:",
      pageNumber,
      "limit:",
      limitNumber
    );
    console.log("🧠 Sort option:", sort);
    console.log("🔍 Query object:", query);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      throw new Error("Page and limit must be positive integers.");
    }

    const skip = (pageNumber - 1) * limitNumber;
    console.log("🚀 Skip count:", skip);

    const queryBuilder = model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    if (populate) {
      if (Array.isArray(populate)) {
        console.log("🔗 Populating multiple:", populate.length);
        populate.forEach((p) => queryBuilder.populate(p));
      } else {
        console.log("🔗 Populating single:", populate);
        queryBuilder.populate(populate);
      }
    }

    const [data, totalCount] = await Promise.all([
      queryBuilder.exec(),
      model.countDocuments(query),
    ]);

    console.log(
      "📦 Paginate result count — data:",
      data.length,
      "totalCount:",
      totalCount
    );

    return {
      data,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  } catch (error) {
    console.error("❌ Error in paginate function:", error);
    throw error;
  }
};

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

//   FILTER 
  filter() {
    let queryString = JSON.stringify(this.queryStr);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const queryObj = JSON.parse(queryString);

    this.query = this.query.find(queryObj);
    return this;
  }

//   SORTING 
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("name");
    }

    return this;
  }

//   LIMITED FIELDS 
  limitingFields() {
    if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }

      return this
  }

//   PAGINATION 
  pagination() {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 10;
    // PAGE 1 : 1-10; PAGE 2: 11-20; PAGE 3: 21 - 30
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   const count = await MovieModel.countDocuments();
    //   if (skip >= count) {
    //     throw new Error("This page is not found!");
    //   }
    // }
    return this
  }
}

module.exports = ApiFeatures;

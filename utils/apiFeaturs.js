const {
  startAt,
  where,
  limit,
  query,
  orderBy,
  getDocs,
} = require("firebase/firestore");

class ApiFeaturs {
  #filterField;
  #queryObj;
  #doc;
  transformedQuery = [];
  constructor(queryParams, doc) {
    this.#doc = doc;
    this.#queryObj = { ...queryParams };
    ["page", "sort", "limit", "fields"].forEach((el) => delete queryParams[el]);
    this.#filterField = queryParams;
    Object.entries(this.#filterField).forEach((obj) => {
      this.transformedQuery.push(where(obj[0], "==", obj[1]));
    });
  }
  builtFbQuery = async () => {
    const page = this.#queryObj.page * 1 || 1;
    const limitCount = this.#queryObj.limit * 1 || 10;
    const skip = (page - 1) * limitCount;
    console.log(this.#queryObj.sort);
    const first = query(
      this.#doc,
      ...this.transformedQuery,
      limit(skip + 1)
    );
    const documentSnapshots = await getDocs(first);
    this.filterCollections(documentSnapshots);
  };
  filterCollections(documentSnapshots) {
    Object.keys(this.#queryObj).forEach((key) => {
      switch (key) {
        case "sort":
          this.transformedQuery.push(orderBy(this.#queryObj[key]));
          break;
        case "page":
          const lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
          this.transformedQuery.push(startAt(lastVisible));
          break;
        case "limit":
          this.transformedQuery.push(limit(this.#queryObj[key]));
          break;
      }
    });
  }
}

module.exports = ApiFeaturs;

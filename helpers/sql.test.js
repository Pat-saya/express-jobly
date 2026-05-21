const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("works: converts js object to sql update data", function () {
    const result = sqlForPartialUpdate(
      {
        firstName: "Bow",
        age: 34,
      },
      {
        firstName: "first_name",
      }
    );

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Bow", 34],
    });
  });

  test("works: no jsToSql conversion", function () {
    const result = sqlForPartialUpdate(
      {
        title: "Engineer",
      },
      {}
    );

    expect(result).toEqual({
      setCols: '"title"=$1',
      values: ["Engineer"],
    });
  });

  test("throws error if no data", function () {
    expect(function () {
      sqlForPartialUpdate({}, {});
    }).toThrow(BadRequestError);
  });
});

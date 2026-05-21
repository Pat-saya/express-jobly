"use strict";

const db = require("../db.js");
const Job = require("./job");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  test("works", async function () {
    const newJob = await Job.create({
      title: "New Job",
      salary: 50000,
      equity: "0.1",
      companyHandle: "c1",
    });

    expect(newJob).toEqual({
      id: expect.any(Number),
      title: "New Job",
      salary: 50000,
      equity: "0.1",
      companyHandle: "c1",
    });
  });
});

describe("findAll", function () {
  test("works", async function () {
    await Job.create({
      title: "Job 1",
      salary: 50000,
      equity: "0.1",
      companyHandle: "c1",
    });

    const jobs = await Job.findAll();

    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Job 1",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      },
    ]);
  });
});

describe("get", function () {
  test("works", async function () {
    const newJob = await Job.create({
      title: "Get Job",
      salary: 70000,
      equity: "0.2",
      companyHandle: "c1",
    });

    const job = await Job.get(newJob.id);

    expect(job).toEqual({
      id: newJob.id,
      title: "Get Job",
      salary: 70000,
      equity: "0.2",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(999999);
      fail();
    } catch (err) {
      expect(err.message).toEqual("No job: 999999");
    }
  });
});

describe("update", function () {
  test("works", async function () {
    const newJob = await Job.create({
      title: "Old Job",
      salary: 40000,
      equity: "0",
      companyHandle: "c1",
    });

    const updatedJob = await Job.update(newJob.id, {
      title: "Updated Job",
      salary: 90000,
    });

    expect(updatedJob).toEqual({
      id: newJob.id,
      title: "Updated Job",
      salary: 90000,
      equity: "0",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(999999, {
        title: "Nope",
      });
      fail();
    } catch (err) {
      expect(err.message).toEqual("No job: 999999");
    }
  });
});

describe("remove", function () {
  test("works", async function () {
    const newJob = await Job.create({
      title: "Delete Job",
      salary: 30000,
      equity: "0",
      companyHandle: "c1",
    });

    await Job.remove(newJob.id);

    try {
      await Job.get(newJob.id);
      fail();
    } catch (err) {
      expect(err.message).toEqual(`No job: ${newJob.id}`);
    }
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(999999);
      fail();
    } catch (err) {
      expect(err.message).toEqual("No job: 999999");
    }
  });
});

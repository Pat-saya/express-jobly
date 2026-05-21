"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

const Job = require("../models/job");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /jobs", function () {
  test("works for anon", async function () {
    const job = await Job.create({
      title: "Test Job",
      salary: 50000,
      equity: "0.1",
      companyHandle: "c1",
    });

    const resp = await request(app).get("/jobs");

    expect(resp.body).toEqual({
      jobs: [
        {
          id: job.id,
          title: "Test Job",
          salary: 50000,
          equity: "0.1",
          companyHandle: "c1",
        },
      ],
    });
  });
});

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const job = await Job.create({
      title: "Single Job",
      salary: 70000,
      equity: "0.2",
      companyHandle: "c1",
    });

    const resp = await request(app).get(`/jobs/${job.id}`);

    expect(resp.body).toEqual({
      job: {
        id: job.id,
        title: "Single Job",
        salary: 70000,
        equity: "0.2",
        companyHandle: "c1",
      },
    });
  });

  test("not found if no such job", async function () {
    const resp = await request(app).get(`/jobs/999999`);

    expect(resp.statusCode).toEqual(404);
  });
});

describe("POST /jobs", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "New Route Job",
        salary: 80000,
        equity: "0.3",
        companyHandle: "c1",
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(201);

    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "New Route Job",
        salary: 80000,
        equity: "0.3",
        companyHandle: "c1",
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/jobs").send({
      title: "New Route Job",
      salary: 80000,
      equity: "0.3",
      companyHandle: "c1",
    });

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: 123,
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(400);
  });
});

describe("PATCH /jobs/:id", function () {
  test("works for admin", async function () {
    const job = await Job.create({
      title: "Old Job",
      salary: 40000,
      equity: "0",
      companyHandle: "c1",
    });

    const resp = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({
        title: "Updated Job",
        salary: 90000,
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({
      job: {
        id: job.id,
        title: "Updated Job",
        salary: 90000,
        equity: "0",
        companyHandle: "c1",
      },
    });
  });

  test("unauth for anon", async function () {
    const job = await Job.create({
      title: "Old Job",
      salary: 40000,
      equity: "0",
      companyHandle: "c1",
    });

    const resp = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({ title: "Updated Job" });

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if trying to change companyHandle", async function () {
    const job = await Job.create({
      title: "Old Job",
      salary: 40000,
      equity: "0",
      companyHandle: "c1",
    });

    const resp = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({ companyHandle: "c2" })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(400);
  });
});


describe("DELETE /jobs/:id", function () {
  test("works for admin", async function () {
    const job = await Job.create({
      title: "Delete Job",
      salary: 30000,
      equity: "0",
      companyHandle: "c1",
    });

    const resp = await request(app)
      .delete(`/jobs/${job.id}`)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({
      deleted: job.id,
    });
  });

  test("unauth for anon", async function () {
    const job = await Job.create({
      title: "Delete Job",
      salary: 30000,
      equity: "0",
      companyHandle: "c1",
    });

    const resp = await request(app).delete(`/jobs/${job.id}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such job", async function () {
    const resp = await request(app)
      .delete(`/jobs/999999`)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(404);
  });
});
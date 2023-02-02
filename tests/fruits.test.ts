import supertest from "supertest";
import app from "../src/app";

const invalidBody = {
    invalid: true,
};

const validBody = {
    name: "Melancia",
    price: "1500",
};

describe("POST /fruits", () => {
    it("Should respond with status 422 if invalid body", async () => {
        const result = await supertest(app).post("/fruits").send(invalidBody);

        expect(result.status).toEqual(422);
    });

    it("Should respond with status 201 if valid body", async () => {
        const postResult = await supertest(app).post("/fruits").send(validBody);
        expect(postResult.status).toEqual(201);

        const getResult = await supertest(app).get("/fruits");
        expect(getResult.body).toHaveLength(1);
    });

    it("Should respond with status 409 if fruit already exists", async () => {
        const result = await supertest(app).post("/fruits").send(validBody);
        expect(result.status).toEqual(409);
    });
});

describe("GET /fruits", () => {
    it("Should respond with status 200 and body with all fruits", async () => {
        const result = await supertest(app).get("/fruits");

        expect(result.status).toEqual(200);
        expect(result.body).toHaveLength(1);
    });
});

describe("GET /fruits/:id", () => {
    it("Should respond with status 404 if invalid id", async () => {
        const result = await supertest(app).get("/fruits/invalidId");

        expect(result.status).toEqual(404);
    });

    it("Should respond with status 404 if there isn't a registered fruit with inserted id", async () => {
        const result = await supertest(app).get("/fruits/9");

        expect(result.status).toEqual(404);
    });

    it("Should respond with status 200 and body with specific fruit", async () => {
        const result = await supertest(app).get("/fruits/1");

        expect(result.status).toEqual(200);
        expect(result.body).toEqual({ id: 1, ...validBody });
    });
});

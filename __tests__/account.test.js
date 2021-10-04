const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/config/knex');
const { expect } = require('@jest/globals');

describe("accounts", () => {

    beforeAll(async () => {
        await knex('peoples').truncate();
        await knex('accounts').truncate();
        await knex('operations').truncate();
    });

    afterAll(async () => {
        await knex('peoples').truncate();
        await knex('accounts').truncate();
        await knex('operations').truncate();
    });

    it("create account", async () => {

        const res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "maria",
                cpf: "123.123.517-12",
                birthDate: "2000-08-10"
            });

        expect(res.status).toBe(200);
    });

    it("create account birthDate error", async () => {

        const res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.123.517-04",
                birthDate: "1999/10/08"
            });

        expect(res.status).toBe(400);
    });

    it("account cpf repeated", async () => {

        const res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.123.517-04",
                birthDate: "1999/10/08"
            });

        expect(res.status).toBe(400);
    });

    it("deposit account", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.517.704-10",
                birthDate: "1999-11-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 10000
            });

        expect(res.status).toBe(200);
    });

    it("deposit value 0", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.517.704-08",
                birthDate: "1999-07-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 0
            });

        expect(res.status).toBe(400);
    });

    it("consult value balance account", async () => {

        let res = await request(app)
        .post(`/api/v1/accounts`)
        .send({
            name: "luana",
            cpf: "123.517.703-11",
            birthDate: "1999-10-22"
        });
        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 100
            });

        res = await request(app).get(`/api/v1/accounts/${idAccount}`)

        expect(res.status).toBe(200);
    });

    it("grab account", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.516.704-11",
                birthDate: "1999-10-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 100
            });

        res = await request(app)
            .put(`/api/v1/accounts/grab`)
            .send({
                idAccount,
                value: 50
            });

        expect(res.status).toBe(200);
    });

    it("grab balance insufficient", async () => {

        let res = await request(app)
        .post(`/api/v1/accounts`)
        .send({
            name: "luana",
            cpf: "123.507.704-11",
            birthDate: "1999-10-22"
        });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 100
            });

        res = await request(app)
            .put(`/api/v1/accounts/grab`)
            .send({
                idAccount,
                value: 200
            });

        expect(res.status).toBe(400);
    });


    it("blocked account", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.017.704-11",
                birthDate: "1999-10-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/block`)
            .send({
                idAccount
            });

        expect(res.status).toBe(200);
    });

    it("deposit account blocked", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "120.517.704-11",
                birthDate: "1999-10-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/block`)
            .send({
                idAccount
            });

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 154.52
            });

        expect(res.status).toBe(400);
    });

    it("grab account blocked", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.217.704-11",
                birthDate: "1999-10-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/block`)
            .send({
                idAccount
            });

        res = await request(app)
            .put(`/api/v1/accounts/grab`)
            .send({
                idAccount,
                value: 152.00
            });

        expect(res.status).toBe(400);
    });

    it("create account cpf invalid", async () => {

        const res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "josefa",
                cpf: "123",
                birthDate: "1999/10/08"
            });

        expect(res.status).toBe(400);
    });

    it("consult balance account blocked", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "luana",
                cpf: "123.587.704-11",
                birthDate: "1999-10-22"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/block`)
            .send({
                idAccount
            });

        res = await request(app).get(`/api/v1/accounts/${idAccount}`)

        expect(res.status).toBe(400);
    });

});
const request = require('supertest');
const app = require('../src/app');
const { format, addDays } = require('date-fns');
const knex = require('../src/config/knex');
const { expect } = require('@jest/globals');

describe("operations", () => {

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

    it("consult extract", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "raulira",
                cpf: "652.148.210-69",
                birthDate: "1950-12-13"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 123.12
            });

        res = await request(app)
            .put(`/api/v1/accounts/grab`)
            .send({
                idAccount,
                value: 10
            });


        res = await request(app).get(`/api/v1/operations/extract/${idAccount}`)

        expect(res.status).toBe(200);
    });

    it("consult extract not exist", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "heloiza",
                cpf: "539.233.120-32",
                birthDate: "1950-12-13"
            });

        const idAccount = res.body.idAccount;

        res = await request(app).get(`/api/v1/operations/extract/${idAccount}`)

        expect(res.status).toBe(400);
    });

    it("consult extract period", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "raulira",
                cpf: "743.119.150-20",
                birthDate: "1950-12-13"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .put(`/api/v1/accounts/deposit`)
            .send({
                idAccount,
                value: 123.12
            });

        res = await request(app)
            .put(`/api/v1/accounts/grab`)
            .send({
                idAccount,
                value: 10
            });

        let finalDate = new Date();
        finalDate = addDays(finalDate, 2);
        finalDate = format(finalDate, 'yyyy-MM-dd');

        res = await request(app)
            .post(`/api/v1/operations/extract-period/${idAccount}`)
            .send({
                initialDate: format(new Date(), 'yyyy-MM-dd'),
                finalDate
            });

        expect(res.status).toBe(200);
    });

    it("consult extract period not exist", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "robson",
                cpf: "773.727.500-24",
                birthDate: "1950-12-13"
            });

        const idAccount = res.body.idAccount;

        let finalDate = new Date();
        finalDate = addDays(finalDate, 2);
        finalDate = format(finalDate, 'yyyy-MM-dd');

        res = await request(app)
            .post(`/api/v1/operations/extract-period/${idAccount}`)
            .send({
                initialDate: format(new Date(), 'yyyy-MM-dd'),
                finalDate
            });

        expect(res.status).toBe(400);
    });

    it("consult extract date erro", async () => {

        let res = await request(app)
            .post(`/api/v1/accounts`)
            .send({
                name: "arthur",
                cpf: "647.939.570-05",
                birthDate: "1950-12-13"
            });

        const idAccount = res.body.idAccount;

        res = await request(app)
            .post(`/api/v1/operations/extract-period/${idAccount}`)
            .send({
                initialDate: '20/07/2020',
                finalDate: '20/12/2020'
            });

        expect(res.status).toBe(400);
    });


});
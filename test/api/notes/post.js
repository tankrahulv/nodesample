process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app.js');
const conn = require('../../../db/index.js');

describe('POST /addUser', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err));
  })

  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err));
  })

  it('OK, creating a new addUser works', (done) => {
    request(app).post('/addUser')
      .send({ name: 'addUser', text: "AAA" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('name');
        expect(body).to.contain.property('text');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, addUser requires text', (done) => {
    request(app).post('/addUser')
      .send({ name: 'addUser' })
      .then((res) => {
        const body = res.body;
        expect(body.errors.text.name)
          .to.equal('ValidatorError')
        done();
      })
      .catch((err) => done(err));
  });
})

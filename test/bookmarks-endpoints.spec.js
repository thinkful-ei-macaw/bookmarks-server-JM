const knex = require('knex');
const app = require('../src/app');
const { TEST_DB_URL } = require('../src/config');

const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe('Bookmarks endpoints', () => {
  let db;

  before('set up db instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DB_URL
    });

    app.set('db', db);
  });

  const cleanBookmarks = () => db.from('bookmarks').truncate();
  before('clean the table', cleanBookmarks);
  afterEach('clean the table', cleanBookmarks);

  after('disconnect from the db', () => db.destroy());


  // GET requests (READ)
  context('Given bookmarks exist in the table', () => {
    const testBookmarks = makeBookmarksArray();

    beforeEach(() => {
      return db
        .into('bookmarks')
        .insert(testBookmarks);
    });

    it('GET /bookmarks responds with 200 and an array of bookmarks', () => {
      supertest(app)
        .get('/bookmarks')
        .expect(200, testBookmarks);
    });

    it('GET /bookmarks/:bookmark_id responds with 200 and the specified bookmark', () => {
      const bookmark_id = 2;
      const testBookmark = testBookmarks[bookmark_id - 1];

      supertest(app)
        .get(`/bookkmarks/${bookmark_id}`)
        .expect(200, testBookmark);
    });

  });

  context('Given no bookmarks', () => {
    it('GET /bookmarks responds with 200 and an empty array', () => {
      supertest(app)
        .get('/bookmarks')
        .expect(200, []);
    });

    it('GET /bookmarks/:bookmark_id responds with 404', () => {
      const bookmark_id = 2;

      supertest(app)
        .get(`/bookkmarks/${bookmark_id}`)
        .expect(404, 'Bookmark Not Found');
    });
  });


});
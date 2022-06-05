/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
    user_id: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });

  // memberikan constraint foreign key pada kolom note_id dan user_id terhadap notes.id dan users.id
  pgm.addConstraint('comments', 'fk_comments.user_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};

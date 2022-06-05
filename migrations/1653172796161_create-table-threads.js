/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('threads', {
      id: {
        type: 'VARCHAR(255)',
        primaryKey: true,
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      body: {
        type: 'TEXT',
        notNull: true,
      },
      date: {
        type: 'DATE',
        notNull: true
      },
      user_id: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
    });

    // memberikan constraint foreign key pada kolom note_id dan user_id terhadap notes.id dan users.id
    pgm.addConstraint('threads', 'fk_threads.user_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('threads');
  };
  
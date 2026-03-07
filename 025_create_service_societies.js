exports.up = async (pgm) => {
  pgm.createTable('service_societies', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },

    service_id: {
      type: 'uuid',
      notNull: true,
      references: 'services(id)',
      onDelete: 'CASCADE',
    },

    society_id: {
      type: 'uuid',
      notNull: true,
      references: 'societies(id)',
      onDelete: 'CASCADE',
    },

    is_active: {
      type: 'boolean',
      notNull: true,
      default: true,
    },

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint(
    'service_societies',
    'unique_service_society',
    'UNIQUE(service_id, society_id)'
  );

  pgm.createIndex('service_societies', ['service_id']);
  pgm.createIndex('service_societies', ['society_id']);
  pgm.createIndex('service_societies', ['is_active']);
};

exports.down = async (pgm) => {
  pgm.dropTable('service_societies');
};

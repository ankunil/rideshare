var Schema = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true},
    password: {type: 'string', maxlength: 254, nullable: false},
    username: {type: 'string', maxlength: 150, nullable: false, unique: true}
  },
  rides: {
    id: {type: 'increments', nullable: false, primary: true},
    destination: {type: 'string', maxlength: 150, nullable: false},
    spacesAvailable: {type: 'integer', nullable: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    leaving_at: {type: 'dateTime', nullable: true},
    cancelled: {type: 'boolean', nullable: true}
  },
  requests: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    ride_id: {type: 'integer', nullable: false, unsigned: true},
    accepted: {type: 'boolean', nullable: true},
    cancelled: {type: 'boolean', nullable: true},
    created_at: {type: 'dateTime', nullable: false},
    updated_at: {type: 'dateTime', nullable: true}
  }
};
module.exports = Schema;

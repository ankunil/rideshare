var Schema = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true},
    password: {type: 'string', maxlength: 254, nullable: false},
    username: {type: 'string', maxlength: 150, nullable: false, unique: true}
  }
  rides: {
    id: {type: 'increments', nullable: false, primary: true},
    destination: {type: 'string', maxlength: 150, nullable: false},
    spacesAvailable: {type: 'integer', nullable: true},
    userId: {type: 'integer', nullable: false, unsigned: true},
    leavingAt: {type: 'dateTime', nullable: true},
    cancelled: {type: 'boolean', nullable: true}
  },
  requests: {
    id: {type: 'increments', nullable: false, primary: true},
    userId: {type: 'integer', nullable: false, unsigned: true},
    rideId: {type: 'integer', nullable: false, unsigned: true},
    accepted: {type: 'boolean', nullable: true},
    cancelled: {type: 'boolean', nullable: true},
    createdAt: {type: 'dateTime', nullable: false},
    updatedAt: {type: 'dateTime', nullable: true}
  }
};
module.exports = Schema;

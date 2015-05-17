var Schema = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true},
    password: {type: 'string', maxlength: 254, nullable: false},
    username: {type: 'string', maxlength: 150, nullable: false, unique: true}
  }
};
module.exports = Schema;

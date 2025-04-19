const bcrypt = require('bcryptjs');

const plainPassword = 'hajar'; 
const hashedPassword = '$2b$10$oWa/UMI7WFaEseI5fTzHJOre0aG9iCQegkf.WlBNjeOub1IFo34U6'; 

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error:', err);
    return;
  }

  if (isMatch) {
    console.log('Password is correct');
  } else {
    console.log('Password is incorrect');
  }
});

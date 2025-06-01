import { addAdminUser } from './addAdminUser.js';

async function main() {
  // Get email from command line arguments
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address');
    console.log('Usage: node addAdminUserCLI.js "user@example.com"');
    process.exit(1);
  }
  
  console.log(`Attempting to add admin privileges to ${email}...`);
  
  try {
    const result = await addAdminUser(email);
    
    if (result.success) {
      console.log(`✅ SUCCESS: ${result.message}`);
      process.exit(0);
    } else {
      console.error(`❌ ERROR: ${result.message}`);
      if (result.error) {
        console.error('Details:', result.error);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error);
    process.exit(1);
  }
}

main();
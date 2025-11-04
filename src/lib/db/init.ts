import { initializeRooms } from './rooms';
import { initializeActiveRooms } from './activeRooms';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Initialize rooms with default data
    console.log('Creating rooms...');
    await initializeRooms();

    // Initialize active rooms
    console.log('Creating active room records...');
    await initializeActiveRooms();

    console.log('Database initialization complete!');
    return { success: true, message: 'Database initialized successfully!' };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, message: `Error: ${error}` };
  }
}

export async function checkDatabaseStatus() {
  // This can be used to check if the database is already initialized
  // For now, we'll just return a status
  return { initialized: false };
}

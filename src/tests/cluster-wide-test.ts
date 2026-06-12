import { DocumentStore } from 'ravendb';
import { delay } from '../common/delay';
import { User } from '../models/user';
import { faker } from '@faker-js/faker';
import { settings } from '../common/settings';

async function runTest() {
  const store = new DocumentStore(
    settings.CLUSTER_NODES_URLS,
    settings.DB_NAME);

  store.initialize();

  while(true) {
    const session = store.openSession({
      transactionMode: 'ClusterWide',
    });
  
    const user = new User(
      faker.name.firstName(), 
      new Date().toISOString()
    );
  
    await session.store(user);
    await session.saveChanges();
    console.log(`doc saved ${JSON.stringify(user)}`);
    await delay(3000);
  }
}

runTest();



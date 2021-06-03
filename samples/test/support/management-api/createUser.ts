import { Client, Group, User } from '@okta/okta-sdk-nodejs';
import { v4 as uuidv4 } from 'uuid';
import { getConfig } from '../../util';
import a18nClient, {A18nProfile} from './a18nClient';
import deleteUser from './deleteUser';

export default async (firstName: string, assignToGroup: string = 'Basic Auth Web'): Promise<[User, A18nProfile]> => {
  const config = getConfig();
  const oktaClient = new Client({
    orgUrl: config.orgUrl,
    token: config.oktaAPIKey,
  });

  let a18nProfile;
  let user;
  try {
    a18nProfile = await a18nClient.createProfile();
    if (!a18nProfile.profileId) {
      throw new Error(`a18n profile was not created: ${a18nProfile}`);
    }

    user = await oktaClient.createUser({
      profile: {
        firstName: firstName,
        lastName: `Mc${firstName}face`,
        email: a18nProfile.emailAddress,
        login: a18nProfile.emailAddress
      },
      credentials: {
        password : { value: uuidv4() }
      }
    }, {
      activate: true
    });

    // TODO: create test group and attach password recovery policy during test run when API supports it
    const {value: testGroup} = await oktaClient.listGroups({
      q: assignToGroup
    }).next();

    if (!testGroup) {
      throw new Error(`Group "${assignToGroup}" is not found`);
    }

    await oktaClient.assignUserToApplication(config.clientId as string, {
      id: user.id
    });

    await oktaClient.addUserToGroup((testGroup as Group).id, user.id);
    return [user, a18nProfile];
  } catch (err) {
    await deleteUser(user, a18nProfile);
    throw err;
  }
};
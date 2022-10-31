import { PasswordProfile, Status, UpdatePasswordPayload } from '../types';
import BaseTransaction from './Base';
import { generateRequestFnFromLinks } from '../request';

export default class PasswordTransaction extends BaseTransaction {
  profile: PasswordProfile;
  status: Status;

  // eslint-disable-next-line no-use-before-define
  get: () => Promise<PasswordTransaction>;
  enroll?: (payload: UpdatePasswordPayload) => Promise<PasswordTransaction>;
  update?: (payload: UpdatePasswordPayload) => Promise<PasswordTransaction>;
  delete?: () => Promise<BaseTransaction>;

  constructor(oktaAuth, options) {
    super(oktaAuth, options);

    const { res, accessToken } = options;
    // assign required fields from res
    const { profile, status, _links } = res;
    this.profile = profile;
    this.status = status;


    // assign transformed fns to transaction
    this.get = async () => {
      const fn = generateRequestFnFromLinks({ 
        oktaAuth, 
        accessToken, 
        methodName: 'get', 
        links: _links,
        transactionClassName: 'PasswordTransaction'
      });
      return await fn() as PasswordTransaction;
    };

    if (this.status == Status.NOT_SETUP) {
      this.enroll = async () => {
        const fn = generateRequestFnFromLinks({ 
          oktaAuth, 
          accessToken, 
          methodName: 'post', 
          links: _links,
          transactionClassName: 'PasswordTransaction'
        });
        return await fn() as PasswordTransaction;
      };
    }
    else {
      this.update = async () => {
        const fn = generateRequestFnFromLinks({ 
          oktaAuth, 
          accessToken, 
          methodName: 'put', 
          links: _links,
          transactionClassName: 'PasswordTransaction'
        });
        return await fn() as PasswordTransaction;
      };
  
      this.delete = async () => {
        const fn = generateRequestFnFromLinks({ 
          oktaAuth, 
          accessToken, 
          methodName: 'delete', 
          links: _links 
        });
        return await fn() as BaseTransaction;
      };
    }
  }
}
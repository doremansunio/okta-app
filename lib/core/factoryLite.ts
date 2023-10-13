import { StorageManagerConstructor } from '../storage/types';
import { OktaAuthConstructor, OktaAuthOptionsConstructor } from '../base/types';

import { OktaAuthCoreOptions } from './types';
import { createOktaAuthBase } from '../base';
import { mixinStorage } from '../storage/mixin';
import { mixinHttp } from '../http/mixin';
import {
  OAuthStorageManagerInterface,
  OktaAuthOAuthInterfaceLite,
  PKCETransactionMeta,
  TransactionManagerConstructor,
  TransactionManagerInterface
} from '../oidc/types';
import { mixinSession } from '../session/mixin';
import { mixinOAuthLite } from '../oidc/mixin/lite';

export function createOktaAuthCoreLite<
  M extends PKCETransactionMeta = PKCETransactionMeta,
  S extends OAuthStorageManagerInterface<M> = OAuthStorageManagerInterface<M>,
  O extends OktaAuthCoreOptions = OktaAuthCoreOptions,
  TM extends TransactionManagerInterface = TransactionManagerInterface
>(
  StorageManagerConstructor: StorageManagerConstructor<S>,
  OptionsConstructor: OktaAuthOptionsConstructor<O>,
  TransactionManagerConstructor: TransactionManagerConstructor<TM>
): OktaAuthConstructor<OktaAuthOAuthInterfaceLite<M, S, O, TM>>
{
  const Base = createOktaAuthBase(OptionsConstructor);
  const WithStorage = mixinStorage<S, O>(Base, StorageManagerConstructor);
  const WithHttp = mixinHttp<S, O>(WithStorage);
  const WithSession = mixinSession<S, O>(WithHttp);
  const WithOAuth = mixinOAuthLite<M, S, O, TM>(WithSession, TransactionManagerConstructor);
  return WithOAuth;
}

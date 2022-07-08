/* eslint-disable max-statements */
/* eslint-disable complexity */
/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
import {
  OktaAuthOptions, 
  HttpAPI,
  OktaAuthHttpInterface,
} from '../types';
import { get, setRequestHeader } from '../http';
import { StorageManager } from '../StorageManager';
import { buildOptions } from '../options';
import { OktaUserAgent } from '../OktaUserAgent';
import { toQueryString } from '../util';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
// Do not use this type in code, so it won't be emitted in the declaration output
import Emitter from 'tiny-emitter';

export default class OktaAuthCore implements OktaAuthHttpInterface {
  options: OktaAuthOptions;
  storageManager: StorageManager;
  http: HttpAPI;
  emitter: any;
  _oktaUserAgent: OktaUserAgent;

  constructor(...args: any[]) {
    const options = this.options = buildOptions(args[0] as OktaAuthOptions);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.storageManager = new StorageManager(options.storageManager!, options.cookies!, options.storageUtil!);
    this._oktaUserAgent = new OktaUserAgent();

    // HTTP
    this.http = {
      setRequestHeader: setRequestHeader.bind(null, this)
    };

   this.emitter = new Emitter();
  }

  setHeaders(headers) {
    this.options.headers = Object.assign({}, this.options.headers, headers);
  }

  getIssuerOrigin(): string {
    // Infer the URL from the issuer URL, omitting the /oauth2/{authServerId}
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.options.issuer!.split('/oauth2/')[0];
  }

  webfinger(opts): Promise<object> {
    var url = '/.well-known/webfinger' + toQueryString(opts);
    var options = {
      headers: {
        'Accept': 'application/jrd+json'
      }
    };
    return get(this, url, options);
  }
}

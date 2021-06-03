import { JSONSerializable } from '../../../util/json';
import { AccAddress } from '../../strings';
import { Coins } from '../../Coins';
import {
  JSONRawMessageToDict,
  dictToJSONRawMessage,
} from '../../../util/contract';

export class MsgInstantiateContract extends JSONSerializable<MsgInstantiateContract.Data> {
  public init_coins: Coins;

  /**
   * @param creator contract creator
   * @param admin is optional contract admin address who can migrate contract
   * @param code_id reference to the code on the blockchain
   * @param init_msg message to configure the initial state of the contract
   * @param init_coins initial amount of coins to be sent to the contract's address
   * @param migratable defines to be migratable or not
   */
  constructor(
    public creator: AccAddress,
    public admin: AccAddress,
    public code_id: number,
    public init_msg: object,
    init_coins: Coins.Input = {},
    public migratable: boolean = false
  ) {
    super();
    this.init_coins = new Coins(init_coins);
  }

  public static fromData(
    data: MsgInstantiateContract.Data
  ): MsgInstantiateContract {
    const {
      value: { creator, admin, code_id, init_msg, init_coins, migratable },
    } = data;
    return new MsgInstantiateContract(
      creator,
      admin,
      Number.parseInt(code_id),
      JSONRawMessageToDict(init_msg),
      Coins.fromData(init_coins),
      migratable
    );
  }

  public toData(): MsgInstantiateContract.Data {
    const { creator, admin, code_id, init_msg, init_coins, migratable } = this;
    return {
      type: 'wasm/MsgInstantiateContract',
      value: {
        creator,
        admin,
        code_id: code_id.toFixed(),
        init_msg: dictToJSONRawMessage(init_msg),
        init_coins: init_coins.toData(),
        migratable,
      },
    };
  }
}

export namespace MsgInstantiateContract {
  export interface Data {
    type: 'wasm/MsgInstantiateContract';
    value: {
      creator: AccAddress;
      admin: AccAddress;
      code_id: string;
      init_msg: string;
      init_coins: Coins.Data;
      migratable: boolean;
    };
  }
}

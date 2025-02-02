import { JSONSerializable } from '../../../util/json';
import { Coins } from '../../Coins';
import { Any } from '@terra-money/terra.proto/google/protobuf/any';
import { BasicAllowance as BasicAllowance_pb } from '@terra-money/terra.proto/cosmos/feegrant/v1beta1/feegrant';

/**
 * BasicAllowance implements Allowance with a one-time grant of tokens
 * that optionally expires. The grantee can use up to SpendLimit to cover fees.
 */
export class BasicAllowance extends JSONSerializable<
  BasicAllowance.Amino,
  BasicAllowance.Data,
  BasicAllowance.Proto
> {
  public spend_limit?: Coins;

  /**
   * @param spend_limit spend_limit allowed to be spent as fee
   * @param expiration allowance's expiration
   */
  constructor(spend_limit?: Coins.Input, public expiration?: Date) {
    super();
    let isZeroCoins = true;
    if (spend_limit) {
      this.spend_limit = new Coins(spend_limit);
      this.spend_limit.map(c => {
        if (!c.amount.isZero()) {
          isZeroCoins = false;
        }
      });
    }
    if (isZeroCoins && expiration == undefined) {
      throw Error('cannot set both of spend_limit and expiration empty');
    }
  }

  public static fromAmino(data: BasicAllowance.Amino): BasicAllowance {
    const {
      value: { spend_limit, expiration },
    } = data;

    return new BasicAllowance(
      spend_limit ? Coins.fromAmino(spend_limit) : undefined,
      expiration ? new Date(expiration) : undefined
    );

    new BasicAllowance('');
  }

  public toAmino(): BasicAllowance.Amino {
    const { spend_limit, expiration } = this;
    return {
      type: 'feegrant/BasicAllowance',
      value: {
        spend_limit: spend_limit?.toAmino() || undefined,
        expiration:
          expiration?.toISOString().replace(/\.000Z$/, 'Z') || undefined,
      },
    };
  }

  public static fromData(proto: BasicAllowance.Data): BasicAllowance {
    const { spend_limit, expiration } = proto;
    return new BasicAllowance(
      spend_limit ? Coins.fromData(spend_limit) : undefined,
      expiration ? new Date(expiration) : undefined
    );
  }

  public toData(): BasicAllowance.Data {
    const { spend_limit, expiration } = this;
    return {
      '@type': '/cosmos.feegrant.v1beta1.BasicAllowance',
      spend_limit: spend_limit?.toData() || undefined,
      expiration:
        expiration?.toISOString().replace(/\.000Z$/, 'Z') || undefined,
    };
  }

  public static fromProto(proto: BasicAllowance.Proto): BasicAllowance {
    return new BasicAllowance(
      Coins.fromProto(proto.spendLimit),
      proto.expiration ? (proto.expiration as Date) : undefined
    );
  }

  public toProto(): BasicAllowance.Proto {
    const { spend_limit, expiration } = this;
    return BasicAllowance_pb.fromPartial({
      expiration,
      spendLimit: spend_limit?.toProto() || undefined,
    });
  }

  public packAny(): Any {
    return Any.fromPartial({
      typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
      value: BasicAllowance_pb.encode(this.toProto()).finish(),
    });
  }

  public static unpackAny(msgAny: Any): BasicAllowance {
    return BasicAllowance.fromProto(BasicAllowance_pb.decode(msgAny.value));
  }
}

export namespace BasicAllowance {
  export interface Amino {
    type: 'feegrant/BasicAllowance';
    value: {
      spend_limit?: Coins.Amino;
      expiration?: string;
    };
  }

  export interface Data {
    '@type': '/cosmos.feegrant.v1beta1.BasicAllowance';
    spend_limit?: Coins.Data;
    expiration?: string;
  }

  export type Proto = BasicAllowance_pb;
}

export const COIN_TYPE = '800001cd';

export const TRANSFER = {
  script: `03000601C707000000003CCC0710C0C2ACD70032FFF8C2ACD7001EFFF6C2ACD70028FFF6CC071094CAA02700C2A2D700FFF6CC071080CC0E1001C2E09700CC07C0028080C3709710DC07C003455448CC0FC0023078BAA02F6C0E04DDF09700DAA2D7C0FFF612D207CC05065052455353425554546F4E`,
  signature: `0030450220201C3ADEEF531C6CD6E8F082477FF048E45F39B85086C2F40BE96840CA4840F6022100C8A36252C7606D9F2D9E6F58538F967C7F6DEFEE52B536439512CB8CD9993DB0`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const ERC20 = {
  script: `03000601C707000000003CCC07C002F800C2ACD70034FFF8C2A5D700FFF6C2ACD7002AFFF6CC071094CAAC270047CC07C01380B844a9059cbb000000000000000000000000CAA02700CC07200000000000000000000000000000000000000000CAA2C7000CCC0E1001C2E09700CC07C0028080C37097C002DC07C00345544811ACC7CC3E1D045B1507C004CC0F104012AC17C03F0401071507C002FF00B5AC17003FCAA6BF00DEF09700250F00CC0FC0023078BAA02F6C0E04DDF0970012AC17C03E0400141507C002FF00B5AC17003EDAA2C7B00CD207CC05065052455353425554546F4E`,
  signature: `30460221009A706915A2EE0AE663ACF90D9DD59BBEEC111EB12B099E4751219DDC993A01E7022100BA25635AB68F4EF7711D8D880A0BB1A81CA899C78884ECC4183B715F8F047D69`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const SmartContract = {
  script: `03000601C707000000003CCC07C002F800C2ACD70032FFF8C2ACD7001EFFF6C2ACD70028FFF6CC071094CAA02700C2A2D700FFF6C2AC97003CCC0E1001C2E09700CC07C0028080C37097C002DC07C003455448D207C005534D415254D207CC05065052455353425554546F4E`,
  signature: `3046022100EC9BC856CEC733451CF4063C60DE27F9E920F7423122CCA19DC47B82E694799C0221008F754911B9C966EF430ED8919A58333D9800E8EBF4FB98B06C797E991DA03697`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const SmartContractSegment = {
  script: `03050601C707000000003CA00700C2ACD70032FFF8C2ACD7001EFFF6C2ACD70028FFF6CC071094CAA02700C2A2D700FFF6C4ACC7003A04CC0E1001C2E09700CC07C0028080BE0710DC07C003455448D207C005534D415254D207CC05065052455353425554546F4E`,
  signature:
    `3045022060FC29B9ACA3BDFA237ED377E410A9A9BB12FB88416C06298857AE17D688992D022100F87D2C80BBECDC7192FF64D13A28F7763D6E1610FC1B1254B3D6446822CBA414`.padStart(
      144,
      `0`
    ),
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const SIGN_MESSAGE = {
  script: `03000601C707000000003CCC07C01A19457468657265756D205369676E6564204D6573736167653A0ACAA09700DC07C003455448D207C0074D455353414745D207CC05065052455353425554546F4E`,
  signature: `0000304402200745C5665A9CE0FA0C2894E77629A33077D9AE76F23566DC804C64BF38D27FC0022076645BEEF5A522A02D272DA3D7065D1F092C5C03B024A3F1B3A19C144CF98970`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const SIGN_TYPED_DATA = {
  script: `03000601C707000000003CCC07C0021901CAA057005AA597C006DC07C003455448D207C006454950373132D207CC05065052455353425554546F4E`,
  signature: `3046022100D1EF6F45445A32475A22495F16716666B3C63F5A1820F25D79D0BE91C68147BA02210083248264E663A6F4FE4E319C06DEAB14CEDC76D17FD4586DEFF828E495FFF5B9`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const EIP1559Transfer = {
  script: `03040601C707000000003CCC071002A00700CC071001C2ACD7003CFFF8C2ACD7001EFFF6C2ACD70028FFF6C2ACD70032FFF6CC071094CAA02700C2A2D700FFF6CC071080CC0710C0BE0710DC07C003455448CC0FC0023078BAA02F6C0E04DDF09700DAA2D7C0FFF612D207CC05065052455353425554546F4E`,
  signature: `3046022100F3CA891D06B8284C01B9E51CD478E7BBA14CD99F137383F2EAD642747222E2F9022100A121B0DE524F00D063DAB9E51E86B4CAF1B1874F79570AEE1AA437DFAD750C1C`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const EIP1559ERC20 = {
  script: `03040601C707000000003CCC071002A00700CC071001C2ACD7003EFFF8C2A5D700FFF6C2ACD7002AFFF6C2ACD70034FFF6CC071094CAAC27004FCC07C01380B844a9059cbb000000000000000000000000CAA02700CC07200000000000000000000000000000000000000000CAA2C7000CCC0710C0BE0710DC07C00345544811ACC7CC461D04631507C004CC0F104012AC17C0470401071507C002FF00B5AC170047CAACBF0048DEF09700250F00CC0FC0023078BAA02F6C0E04DDF0970012AC17C0460400141507C002FF00B5AC170046DAA2C7B00CD207CC05065052455353425554546F4E`,
  signature: `00304502207A63FB17CEA7E123C1BF12CBE3687614FCD677DE13171CC0B275E9659421762A022100ED2A5EC6AB2736C1D9087033CB48181784859A10C8A9674ADEFE34A84D520646`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const EIP1559SmartContract = {
  script: `03040601C707000000003CCC071002A00700CC071001C2ACD7003CFFF8C2ACD7001EFFF6C2ACD70028FFF6C2ACD70032FFF6CC071094CAA02700C2A2D700FFF6C2AC970044CC0710C0BE0710DC07C003455448D207C005534D415254D207CC05065052455353425554546F4E`,
  signature: `003045022100D28537F886B9330A61BB88B7ED436A4E66C50A03EDB883FCB78279FE2C704BD402205C2E473AA2302133B659D7BD95FD8D7D80B7BF5C1B65FCC4519E7B189600BA89`,
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

export const EIP1559SmartContractSegment = {
  script: `03050601C707000000003CCC071002A00700CC071001C2ACD7003CFFF8C2ACD7001EFFF6C2ACD70028FFF6C2ACD70032FFF6CC071094CAA02700C2A2D700FFF6C4ACC7004404CC0710C0BE0710DC07C003455448D207C005534D415254D207CC05065052455353425554546F4E`,
  signature:
    `3045022100F994CBD35DA01724AE1189B299F80FB5DD6A304EB0C27E5DBA7B9AD6588C92E70220170BBE5ADFF78C30FDA82784ED4C647D6D855EBACC5F13D8C171C5E529E1AF39`.padStart(
      144,
      `0`
    ),
  get scriptWithSignature(): string {
    return this.script + this.signature;
  },
};

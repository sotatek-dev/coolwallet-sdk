/* eslint-disable max-len */

export const TRANSACTION_TYPE = {
  TRANSFER: {
    script:
      '03000002C70700000001F5CAA01700CAA11700CAACD70002FFFFCAACD70003FFFFCAAC570004CAAC570024CAAC570044CAAC570064CAAC170084CAAC170085CAAC170086CAACC7008702CAAC170089CAACC7008A04CAAC97008EDC07C003534F4CBAAC5F6C240804DDF09700DAAC97C08E0CD207CC05065052455353425554546F4E',
    signature:
      'FA0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
  SMART_CONTRACT: {
    script:
      '03000002C70700000001F5CAA01700CAA11700CAACD70002FFFFCAACD70003FFFFCAACD70004FFA0CAACD70064FFE0CAAC170084CAAC170085CAAC170086CAAC170087CAAC170088CAAC970089DC07C003534F4CD207C005534D415254D207CC05065052455353425554546F4E',
    signature:
      'FA0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
  SPL_TOKEN: {
    script:
      '03000002C70700000001F5CAA01700CAA11700CAACD70002FFFFCAACD70003FFFFCAACD70004FF80CAACD70084FFE0CAAC1700A4CAAC1700A5CAAC1700A6CAACC700A703CAAC1700AACAAC1700ABCAAC9700ACDC07C003534F4CD207C00353504CDAAC97C0AC0CD207CC05065052455353425554546F4E',
    signature:
      'FA0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
};

export const TRANSFER_PROGRAM_ID = Buffer.alloc(32);
export const TOKEN_PROGRAM_ID = Buffer.from('06ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9', 'hex');
export const LAMPORTS_PER_SOL = 1000000000;

export const COIN_TYPE = '800001f5';
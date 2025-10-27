declare module "applemojis" {
  interface EmojiData {
    emoji: string;
    CLDRShortName?: string;
    code?: string;
  }

  interface AppleMojis {
    getOneByCode: (code: string) => EmojiData | undefined;
  }

  const applemojis: AppleMojis;
  export default applemojis;
}

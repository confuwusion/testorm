export namespace CHANNELS {

  export namespace MAIN {

    export const INFO = {
      RULES_MAIN: `687168795588296741`,
      ANNOUNCEMENT: `510821120052822054`,
      VIDEO_DISCUSSION: `538130873523109888`,
      WEEKLY_FEATURE: `693952244114260079`,
      EVENTS_ANNOUNCEMENT: `581930382115733566`,
      SUGGESTIONS: `552622707620184064`
    } as const;

    export const CHATS = {
      GENERAL: `415019865800310797`,
      OFF_TOPIC: `695032486484377630`,
      INTRODUCTION: `615695864870076420`,
      MEME_PIT: `448224553777365011`
    } as const;

    export const ARTS = {
      ART_SHARING: `416057839849701378`,
      ANIMATION_SHARING: `513851560657158144`,
      MUSIC_SHARING: `617194698729062400`,
      PHOTOGRAPHY_SHARING: `513852156193800203`,
      ART_IMPROVEMENT: `513873498746257448`,
      WORK_IN_PROGRESS: `522497709266042906`,
      COLLAB: `513852343352164375`
    } as const;

    export const VC = {
      NO_MIC: `507764175498379275`,
      CHAT_VC: `415019865800310799`,
      MUSIC_VC: `649439422349049889`,
      AFK_VC: `527774930771902465`
    } as const;

    export const ACTIVITIES = {
      ART_CONTEST: `655968556894257152`,
      ART_GAMES: `691742431053348894`,
      OC_CHAIN: `693271203493707796`,
      EMOJI_SUGGESTIONS: `656343228580364292`,
      QOTD: `602639249115709460`,
      COMMUNICRAFT: `618568997494849536`,
      PLAY_GAMES: `661724960426819624`,
      COUNTING: `696895338153508967`
    } as const;

    export const OTHER = {
      PROMO: `514484356346282049`,
      BOT_MAIN: `530206886935396352`
    } as const;

    export const BOOSTER = {
      BOOSTER_RULES: `662337521136566302`,
      BOOSTER_MAIN: `661707161558319145`,
      BOOSTER_PRIVATE: `662336350040752149`,
      SNEAK_PEEK: `665066835950960659`
    } as const;

    export const MOD = {
      MEMBER_ISSUES: `621147345169416212`,
      MOD_CONTACT: `434505354777198605`,
      MOD_TRAINING: `694336547889348693`,
      MOD_CHAT: ``,
      MOD_DEBATE: `434506080140394501`,
      MOD_RULES: `538098268161441829`,
      MOD_LOG: `661453001461989386`,
      MOD_VC: `511059604713504768`,
      MOD_BOT: `501620403626573824`
    } as const;

    export const ALL = {
      ...INFO,
      ...CHATS,
      ...ARTS,
      ...VC,
      ...ACTIVITIES,
      ...OTHER,
      ...BOOSTER,
      ...MOD
    } as const;

    export const COMMAND = {
      OFF_TOPIC: ALL.OFF_TOPIC,
      BOT_MAIN: ALL.BOT_MAIN,
      BOOSTER_PRIVATE: ALL.BOOSTER_PRIVATE,
      MOD_TRAINING: ALL.MOD_TRAINING,
      MOD_CHAT: ALL.MOD_CHAT,
      MOD_DEBATE: ALL.MOD_DEBATE,
      MOD_BOT: ALL.MOD_BOT
    } as const;

    export const LOG_SAFE = {
      PROMO: OTHER.PROMO,
      BOOSTER_PRIVATE: BOOSTER.BOOSTER_PRIVATE,
      MOD_TRAINING: MOD.MOD_TRAINING,
      MOD_CHAT: MOD.MOD_CHAT,
      MOD_DEBATE: MOD.MOD_DEBATE,
      MOD_LOG: MOD.MOD_LOG,
      MOD_BOT: MOD.MOD_BOT
    } as const;

    export type Any = (typeof ALL)[keyof typeof ALL];

    export type Command = (typeof COMMAND)[keyof typeof COMMAND];

    export type LogSafe = (typeof LOG_SAFE)[keyof typeof LOG_SAFE];

  }

  export namespace TEST {

    export const INFO = {
      // RULES_MAIN: "687168795588296741",
      // ANNOUNCEMENT: "510821120052822054",
      // VIDEO_DISCUSSION: "538130873523109888",
      // WEEKLY_FEATURE: "693952244114260079",
      // EVENTS_ANNOUNCEMENT: "581930382115733566",
      // SUGGESTIONS: "552622707620184064"
    } as const;

    export const CHATS = {
      MAIN: `677780411425751049`,
      OFF_TOPIC: `699345292704612382`

      // MEME_PIT: "448224553777365011",
    } as const;

    export const ARTS = {
      // ART_SHARING: "416057839849701378",
      // ANINATION_SHARING: "513851560657158144",
      // MUSIC_SHARING: "617194698729062400",
      // PHOTOGRAPHY_SHARING: "513852156193800203",
      // ART_IMPROVEMENT: "513873498746257448",
      // WORK_IN_PROGRESS: "522497709266042906",
      // COLLAB: "513852343352164375",
    } as const;

    export const VC = {
      // NO_MIC: "507764175498379275",
      // CHAT_VC: "415019865800310799",
      // MUSIC_VC: "649439422349049889",
      // AFK_VC: "527774930771902465",
    } as const;

    export const ACTIVITIES = {
      // Activities
      // ART_CONTEST: "655968556894257152",
      // ART_GAMES: "691742431053348894",
      // OC_CHAIN: "693271203493707796",
      // EMOJI_SUGGESTIONS: "656343228580364292",
      // QOTD: "602639249115709460",
      // COMMUNICRAFT: "618568997494849536",
      // PLAY_GAMES: "661724960426819624",
      // COUNTING: "696895338153508967",
    } as const;

    export const OTHER = {
      // INTRODUCE: "615695864870076420",
      // PROMO: "514484356346282049",
      BOT_MAIN: `677780888637145089`
    } as const;

    export const BOOSTER = {
      // BOOSTER_RULES: "662337521136566302",
      // BOOSTER_MAIN: "661707161558319145",
      BOOSTER_PRIVATE: `699346459019051089`

      // SNEAK_PEEK: "665066835950960659",
    } as const;

    export const MOD = {
      // MEMBER_ISSUES: "621147345169416212",
      // MOD_CONTACT: "434505354777198605",
      MOD_TRAINING: `699346930970656889`,
      MOD_DEBATE: `699346809688162324`,

      // MOD_RULES: "538098268161441829",
      // MOD_LOG: "661453001461989386",
      // MOD_VC: "511059604713504768",
      MOD_BOT: `697840915665911890`
    } as const;

    export const ALL = {
      ...INFO,
      ...CHATS,
      ...ARTS,
      ...VC,
      ...ACTIVITIES,
      ...OTHER,
      ...BOOSTER,
      ...MOD
    } as const;

    export const COMMAND = {
      OFF_TOPIC: ALL.OFF_TOPIC,
      BOT_MAIN: ALL.BOT_MAIN,
      BOOSTER_PRIVATE: ALL.BOOSTER_PRIVATE,
      MOD_TRAINING: ALL.MOD_TRAINING,

      // MOD_CHAT: ALL.MOD_CHAT,
      // MOD_DEBATE: ALL.MOD_DEBATE,
      MOD_BOT: ALL.MOD_BOT
    } as const;

    export type Any = (typeof ALL)[keyof typeof ALL];

    export type Command = (typeof COMMAND)[keyof typeof COMMAND];

  }

  export const COMMAND = [
    ...Object.values(MAIN.COMMAND),
    ...Object.values(TEST.COMMAND)
  ] as Command[];

  export type Any = MAIN.Any | TEST.Any;

  export type Command = MAIN.Command | TEST.Command;

  export type LogSafe = MAIN.LogSafe;

}

export namespace CATEGORIES {

  export namespace MAIN {

    export const ALL = {
      STATS: `709137476123361360`,
      INFO: `416081635931324420`,
      CHATS: `415019865800310796`,
      ARTS: `695032268850331718`,
      ACTIVITIES: `691739117775749130`,
      OTHER: `603783059459932178`,
      BOOSTER: `661706897904107570`,
      MOD: `434505278235344898`,
      BOTS: `513855423909199874`,
      ARCHIVE: `638181086953996290`
    } as const;

    export const LOG_SAFE = {
      MOD: ALL.MOD,
      BOTS: ALL.BOTS
    } as const;

  }

}

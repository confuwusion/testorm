import { PERMISSIONS, commandChannels } from "../../constants";
import { MessageEmbed } from "discord.js";
import { titleCase } from "string-fn";

const INPUT_CAPTURE = /\{\[inp\]\}/g;

export enum Categories {
  General,
  Fun,
  Utility,
  Moderation,
  Master,
  Watcher
}

const categoryHierarchies: {
  [key in Categories]: PERMISSIONS.HIERARCHIES
} = {
  [Categories.General]: PERMISSIONS.HIERARCHIES.EVERYONE,
  [Categories.Fun]: PERMISSIONS.HIERARCHIES.EVERYONE,
  [Categories.Utility]: PERMISSIONS.HIERARCHIES.EVERYONE,
  [Categories.Moderation]: PERMISSIONS.HIERARCHIES.MOD,
  [Categories.Master]: PERMISSIONS.HIERARCHIES.MASTER,
  [Categories.Watcher]: PERMISSIONS.HIERARCHIES.MOD
};

/**
 * Helper function for second-layer verification
 *
 * @param name Name of faulty parameter
 * @param err Description of the error
 *
 * @returns - Error object with a formatted description
 **/
function commandError(name: string, err: string) {
  return new Error(`Command Error (${name}): ${err}!`);
}

export interface CommandStructure {

  /**
   * Describes what the command does
   **/
  description: string,

  /**
   * Category the command belongs to
   **/
  category: Categories,

  /**
   * The icon that graphically identifies the command
   **/
  icon: CommandIcon,

  /**
   * Parameter definitions of the command
   * Provide at least either {@link CommandArguments.blank} or {@link CommandArguments.detectors} with {@link CommandArguments.usage}
   **/
  args: CommandArguments,

  /**
   * Command usability by members in channels
   **/
  permission?: CommandArgumentPermissions,

  /**
   * Conversion and validation of member arguments
   **/
  parse(pack: any, pieces: string[]): object,

  /**
   * Performing the main functionality of the command
   * Note: It doesn't have to be in a single function. You can link multiple functions by calling them in this function
   **/
  run(pack: any, parsedArgs: object): Promise<Promise<any>[]>
}

interface CommandIcon {

  /**
   * The unicode emoji that represents the icon
   **/
  emoji: string,

  /**
   * The twemoji (important) URL that represents the icon
   **/
  url: string
}

interface CommandArguments {

  /**
   * Describes what the command does if no arguments were provided by the member
   **/
  blank?: string,

  /**
   * a
   **/
  details?: string,

  /**
   * List of regex that represent and break down each parameter.
   * Each array entry represents an individual parameter (in order).
   **/
  detectors?: RegExp[],

  /**
   * Hardcoding parameters that can dynamically accept user input.
   * Each array entry represents an individual parameter (in order).
   * Place {[inp]} anywhere inside individual parameter strings to accept user input in that place, for that parameter.
   **/
  fillers?: string[],

  /**
   * List of various usage instructions
   **/
  usage?: CommandArgumentUsage[]
}

interface CommandArgumentUsage {

  /**
   * A title that describes the usage
   *
   * @example
   *   ```typescript
   *     title: "Set a reminder"
   *   ```
   **/
  title: string,

  /**
   * The parameter structure of this usage
   *
   * @example
   * ```typescript
   *   parameters: [
   *     // Required fixed parameter
   *     // Fixed parameters (usually near the beginning) represent a distinct usage
   *     // They separate major features of the command
   *     `set`,
   *     `[Time]`,
   *      // Optional dynamic parameter.
   *      // The {@link:Command.parse} method should set a default if necessary
   *      // The command shouldn't give an error if argument to this parameter isn't provided
   *     `[Channel?]`
   *     `[Description?]`
   *   ]
   * ```
   **/
  parameters: string[]
}

interface CommandArgumentPermissions {

  /**
   * Restrict the usage of this command to the selected channels
   * Defaults to false
   **/
  exclusive?: boolean,

  /**
   * IF exclusive is false:
   *   Channels any general user can use the command in
   * IF exclusive is true:
   *   Channels the command is meant to be used in
   **/
  channels?: string[],

  /**
   * The hierarchy required for usage of this command
   * Defaults to the hierarchy provided by the category
   **/
  hierarchy?: PERMISSIONS.HIERARCHIES,

  /**
   * Selection of hierarchies from the selected hierarchy
   * Defaults to PERMISSIONS.TRENDS.CURRENT_ABOVE
   **/
  trend: PERMISSIONS.TRENDS
}

/*
 * A member-executable instructions for the bot
 **/
export class Command implements CommandStructure {

  readonly description: CommandStructure["description"];
  readonly category: CommandStructure["category"];
  readonly icon: CommandStructure["icon"];
  readonly args: CommandStructure["args"];
  readonly permission: CommandStructure["permission"];

  readonly run: CommandStructure["run"];
  readonly parse: CommandStructure["parse"] = function(_p, _i): string[] {
    return _i;
  };

  constructor(readonly name: string, {
    description, category, run, parse, icon,
    args: {
      blank = ``,
      details = ``,
      fillers = [],
      usage = [],
      detectors = []
    } = {},
    permission: {
      exclusive = false,
      channels = commandChannels as string[],
      hierarchy = categoryHierarchies[category],
      trend = PERMISSIONS.TRENDS.CURRENT_ABOVE
    }
  }: CommandStructure) {

    if (!(blank.length || usage.length)) {
      throw commandError(name, `Command Usage details are not defined`);
    }
    if (!usage.length !== !detectors.length) {
      throw commandError(name, `Parameters do not correspond with Command Usage`);
    }

    this.description = description;
    this.category = category;
    this.icon = icon;
    this.args = { blank, details, detectors, fillers, usage };
    this.permission = { exclusive, channels, hierarchy, trend };
    this.run = run;
    this.parse = parse;
  }

  hasPermission({ cache, channel, author }) {
    const { memberPermissions } = cache;

    const { exclusive, channels, hierarchy, trend } = this.permission;

    const memberHierarchy = memberPermissions.forCommand(this.name, author.id);
    console.log(`▫️Command:`, this.name);
    console.log(`Member:`, author.username);
    console.log(`Member Hierarchy:`, memberHierarchy);
    console.log(`Belongs to channel:`, channels.includes(channel.id));
    console.log(`Exclusive to channel:`, exclusive);

    // Command's usability in message channel
    if (!channels.includes(channel.id)) {
      const isStaff = memberPermissions.compare(
        PERMISSIONS.HIERARCHIES.MOD,
        PERMISSIONS.TRENDS.CURRENT_ABOVE,
        memberHierarchy
      );
      console.log(`Is staff:`, isStaff);

      // Do not allow if command is not exclusive to channels or if member is not staff
      if ((exclusive || !isStaff) && channel.guild) return 0;
    }

    // Member Command usability
    const commandUsable = memberPermissions.compare(hierarchy, trend, memberHierarchy);
    console.log(`Command Hierarchy and Trend:`, hierarchy, trend);
    console.log(`Command is usable:`, commandUsable);
    return commandUsable;
  }

  createSub(
    name: Command["name"],
    permissions: CommandStructure["permission"],
    fillers: CommandStructure["args"]["fillers"]
  ) {
    return new Subcommand(name, this, permissions, fillers);
  }

  embedTemplate() {
    return new MessageEmbed()
      .setAuthor(titleCase(this.name), this.icon.url);
  }

  extractArgs(content: string): ReadonlyArray<string | ReadonlyArray<string>> {
    const {
      args: { detectors, fillers = [] }
    } = this;

    if (!detectors.length) return [];

    let remaining = content;

    return detectors.map((detector, i) => {
      // Filler is a potentially pre-prepared
      // argument string for a command parameter
      // that might accept user input at
      // specified parts - wherever {[inp]} is
      // found

      // If filler doesn't contain user input tag,
      // it means it is not accepting user input
      // for that parameter

      // There can only be one set of input
      // per filler
      const filler = fillers[i] || `{[inp]}`;

      // Global regex is first given the non-global
      // behaviour (to extract text linearly) and
      // then use the global regex on the
      // non-globally extracted text

      // This logic is used to:
      // - Prevent global regex from extracting
      //   text from elsewhere
      // - Identify the true capture length so that
      //   the captured part can be cut out properly

      // Making global regex linear
      const captureRegex = detector.global
        ? new RegExp(`^((?:(?:${detector.source})\\s*)+)`)
        : detector;


      // Capture user input and place it on every
      // user input tag to complete the argument
      const userCapture = (remaining.match(captureRegex) || [ `` ])[0].replace(/\$&/g, `\\$\\&`);
      const completeArg = filler.replace(INPUT_CAPTURE, userCapture).trim();

      // Use the original regex on the completed
      // argument to produce expected behaviour,
      // thus expected output
      const wholeCapture = completeArg.match(detector) || [ `` ];

      // Take out the captured part from user input
      // If nothing was captured, then this will
      // slice to return the same string
      remaining = remaining.slice(userCapture.length).trim();
      return wholeCapture && !detector.global
        ? wholeCapture[0]
        : wholeCapture;
    });
  }
}

export class Subcommand extends Command {

  readonly inherits: Command;

  constructor(
    name: Command["name"],
    inherits: Command,
    { hierarchy, trend, exclusive, channels }: CommandStructure["permission"],
    fillers: CommandStructure["args"]["fillers"]
  ) {
    super(name, {
      ...inherits,
      permission: {
        ...inherits.permission,
        hierarchy, trend, exclusive,
        channels: channels.length ? channels : inherits.permission.channels
      },
      args: {
        ...inherits.args,
        fillers
      }
    });

    this.inherits = inherits;
  }
}

import Activity from '../../vendor/lucide/icons/activity.js';
import ArrowLeft from '../../vendor/lucide/icons/arrow-left.js';
import ArrowRight from '../../vendor/lucide/icons/arrow-right.js';
import Blocks from '../../vendor/lucide/icons/blocks.js';
import CircleCheck from '../../vendor/lucide/icons/circle-check.js';
import ClipboardList from '../../vendor/lucide/icons/clipboard-list.js';
import Clock3 from '../../vendor/lucide/icons/clock-3.js';
import Code2 from '../../vendor/lucide/icons/code-xml.js';
import Cog from '../../vendor/lucide/icons/cog.js';
import Database from '../../vendor/lucide/icons/database.js';
import GitBranch from '../../vendor/lucide/icons/git-branch.js';
import Instagram from '../../vendor/lucide/icons/instagram.js';
import Linkedin from '../../vendor/lucide/icons/linkedin.js';
import LockKeyhole from '../../vendor/lucide/icons/lock-keyhole.js';
import LogIn from '../../vendor/lucide/icons/log-in.js';
import Mail from '../../vendor/lucide/icons/mail.js';
import Maximize2 from '../../vendor/lucide/icons/maximize-2.js';
import Monitor from '../../vendor/lucide/icons/monitor.js';
import MousePointerClick from '../../vendor/lucide/icons/mouse-pointer-click.js';
import Network from '../../vendor/lucide/icons/network.js';
import RotateCcw from '../../vendor/lucide/icons/rotate-ccw.js';
import Server from '../../vendor/lucide/icons/server.js';
import Undo2 from '../../vendor/lucide/icons/undo-2.js';
import UserRound from '../../vendor/lucide/icons/user-round.js';
import Workflow from '../../vendor/lucide/icons/workflow.js';

/** Ícones Lucide inline: nítidos, temáticos e sem fonte externa ou framework. */
const icons = {
  touch: MousePointerClick,
  message: Mail,
  arrow: ArrowRight,
  door: LogIn,
  system: Blocks,
  check: CircleCheck,
  person: UserRound,
  return: Undo2,
  record: ClipboardList,
  database: Database,
  screen: Monitor,
  server: Server,
  network: Network,
  code: Code2,
  branch: GitBranch,
  pipeline: Workflow,
  pulse: Activity,
  gear: Cog,
  lock: LockKeyhole,
  clock: Clock3,
  instagram: Instagram,
  linkedin: Linkedin,
  reset: RotateCcw,
  expand: Maximize2,
  back: ArrowLeft,
};

const attributes = (values) =>
  Object.entries(values)
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');
const render = ([tag, values, children = []]) =>
  `<${tag} ${attributes(values)}>${children.map(render).join('')}</${tag}>`;

export function icon(name) {
  const definition = icons[name];
  if (!definition) throw new Error(`Ícone Lucide desconhecido: ${name}`);
  return render(definition).replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
}

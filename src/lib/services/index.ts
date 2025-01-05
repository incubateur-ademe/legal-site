import { EspaceMembreService } from "./EspaceMembreService";
import { MdxService } from "./MdxService";

const mdxService = new MdxService();
const espaceMembreService = new EspaceMembreService();

await Promise.all([mdxService.init(), espaceMembreService.init()]);

export { espaceMembreService, mdxService };

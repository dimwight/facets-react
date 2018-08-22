import {
  ContentingApp,
  launchApp as testApps,
  buildContentingLayout,
} from './react/_globals';
import {launchApp as calendar} from './calendar/_locals';
if(false)testApps();
else if(true) new ContentingApp(buildContentingLayout).buildSurface();
else calendar();
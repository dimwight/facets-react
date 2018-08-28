import {
  ContentingApp,
  launchApp as testAppsLaunch,
  buildContentingLayout,
  Specs
} from './react/_globals';
import {launchApp as calendarLaunch} from './calendar/_locals';
if(true)testAppsLaunch(Specs.AllNonSelecting);
else if(true) new ContentingApp(buildContentingLayout).buildSurface();
else calendarLaunch();
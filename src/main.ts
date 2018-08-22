import {
  ContentingApp,
  launchApp as testAppsLaunch,
  buildContentingLayout,
} from './react/_globals';
import {launchApp as calendarLaunch} from './calendar/_locals';
if(false)testAppsLaunch();
else if(true) new ContentingApp(buildContentingLayout).buildSurface();
else calendarLaunch();